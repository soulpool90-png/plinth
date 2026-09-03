import { Hono } from "hono";
import { isPlan, isProduct, type Plan, type Product } from "@plinth/shared";
import type { Env } from "../env.ts";
import {
  applySubscriptionGrant,
  claimToken,
  createCheckout,
  fetchCheckout,
  revokeProduct,
  verifyPolarSignature,
  decodeProductMeta,
} from "../polar.ts";
import { mintApiKey, resolveAuth } from "../auth.ts";
import { json } from "../util.ts";

export const billingRoutes = new Hono<{ Bindings: Env }>();

billingRoutes.post("/v1/checkout", async (c) => {
  const body = (await c.req.json()) as { product?: string; plan?: string };
  if (!body.product || !isProduct(body.product) || !body.plan || !isPlan(body.plan) || body.plan === "free") {
    return json({ error: "product and plan (pro|team) required" }, 400);
  }
  const successUrl = `${c.env.PUBLIC_WEB_URL}/start?checkout_id={CHECKOUT_ID}`;
  const result = await createCheckout(c.env, body.product as Product, body.plan as Exclude<Plan, "free">, successUrl);
  if ("error" in result) return json({ error: result.error }, result.status);
  return json(result);
});

billingRoutes.post("/v1/claim", async (c) => {
  const body = (await c.req.json()) as { token?: string; checkout_id?: string };
  if (body.token) {
    const claimed = await claimToken(c.env, body.token);
    if (!claimed) return json({ error: "Invalid or used claim token" }, 400);
    return json({ api_key: claimed.key, email: claimed.email });
  }
  if (!body.checkout_id) return json({ error: "token or checkout_id required" }, 400);
  const checkout = await fetchCheckout(c.env, body.checkout_id);
  if (!checkout) return json({ error: "Checkout not found" }, 404);
  const status = String(checkout.status ?? "");
  if (status !== "succeeded" && status !== "confirmed") {
    return json({ error: `Checkout not complete (${status})` }, 409);
  }
  const customer = checkout.customer as { id?: string; email?: string } | undefined;
  const products = (checkout.products as Array<{ id?: string }> | undefined) ?? [];
  const productId =
    products[0]?.id ||
    (checkout.product_id as string | undefined) ||
    ((checkout.product as { id?: string } | undefined)?.id);
  const email = customer?.email || (checkout.customer_email as string | undefined);
  if (!email) return json({ error: "Checkout missing customer email" }, 422);

  const grant = await applySubscriptionGrant(c.env, {
    email,
    polarCustomerId: customer?.id,
    polarProductId: productId,
    polarSubscriptionId: (checkout.subscription_id as string | undefined) ?? null,
    status: "active",
  });

  if (grant.apiKey) return json({ api_key: grant.apiKey, email, claim_token: grant.claimToken });

  // Existing customer — mint a fresh key for this claim flow
  const minted = await mintApiKey(c.env, grant.userId);
  return json({ api_key: minted.key, email });
});

billingRoutes.get("/v1/me", async (c) => {
  const auth = await resolveAuth(c.env, c.req.raw, "schema");
  if (!auth.userId) return json({ error: "API key required" }, 401);
  const ents = await c.env.DB.prepare(
    `SELECT product, plan, status, current_period_end FROM entitlements WHERE user_id = ?`,
  )
    .bind(auth.userId)
    .all();
  return json({ email: auth.email, entitlements: ents.results ?? [] });
});

billingRoutes.post("/v1/webhooks/polar", async (c) => {
  const raw = await c.req.text();
  if (!c.env.POLAR_WEBHOOK_SECRET) return json({ error: "Webhook secret not configured" }, 503);
  const ok = await verifyPolarSignature(c.env.POLAR_WEBHOOK_SECRET, c.req.raw.headers, raw);
  if (!ok) return json({ error: "Invalid signature" }, 401);

  const event = JSON.parse(raw) as {
    type?: string;
    data?: Record<string, unknown>;
  };
  const eventId = c.req.header("webhook-id") || crypto.randomUUID();
  const seen = await c.env.DB.prepare(`SELECT id FROM polar_events WHERE id = ?`).bind(eventId).first();
  if (seen) return json({ ok: true, duplicate: true });

  await c.env.DB.prepare(`INSERT INTO polar_events (id, type, processed_at) VALUES (?, ?, ?)`)
    .bind(eventId, event.type ?? "unknown", Date.now())
    .run();

  const type = event.type ?? "";
  const data = event.data ?? {};

  if (type === "order.paid" || type === "subscription.created" || type === "subscription.active") {
    const customer = data.customer as { id?: string; email?: string } | undefined;
    const email =
      customer?.email ||
      (data.user as { email?: string } | undefined)?.email ||
      (data.email as string | undefined);
    const productId =
      (data.product as { id?: string } | undefined)?.id ||
      (data.product_id as string | undefined) ||
      ((data.items as Array<{ product_id?: string }> | undefined)?.[0]?.product_id);
    if (email) {
      await applySubscriptionGrant(c.env, {
        email,
        polarCustomerId: customer?.id,
        polarProductId: productId,
        polarSubscriptionId: (data.id as string | undefined) ?? (data.subscription_id as string | undefined),
        status: "active",
        periodEnd: (data.current_period_end as number | undefined)
          ? Number(data.current_period_end) * (String(data.current_period_end).length < 12 ? 1000 : 1)
          : null,
      });
    }
  }

  if (type === "subscription.revoked" || type === "subscription.canceled") {
    const subId = (data.id as string | undefined) ?? (data.subscription_id as string | undefined);
    if (subId) await revokeProduct(c.env, subId);
  }

  // Touch meta decode so unused import stays meaningful for future mapping logs
  decodeProductMeta(undefined, c.env);

  return json({ ok: true });
});
