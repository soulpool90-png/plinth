import type { Env } from "./env.ts";
import type { Plan, Product } from "@plinth/shared";
import { ensureUser, mintApiKey } from "./auth.ts";
import { id, sha256 } from "./util.ts";

const POLAR_API = "https://api.polar.sh/v1";

export function productIdFor(env: Env, product: Product, plan: Exclude<Plan, "free">): string | undefined {
  const map: Record<string, string | undefined> = {
    "forms:pro": env.POLAR_PRODUCT_FORMS_PRO,
    "forms:team": env.POLAR_PRODUCT_FORMS_TEAM,
    "catch:pro": env.POLAR_PRODUCT_CATCH_PRO,
    "catch:team": env.POLAR_PRODUCT_CATCH_TEAM,
    "schema:pro": env.POLAR_PRODUCT_SCHEMA_PRO,
    "schema:team": env.POLAR_PRODUCT_SCHEMA_TEAM,
  };
  return map[`${product}:${plan}`];
}

export function decodeProductMeta(polarProductId: string | undefined, env: Env): { product: Product; plan: Plan } | null {
  if (!polarProductId) return null;
  const entries: Array<{ product: Product; plan: Plan; id?: string }> = [
    { product: "forms", plan: "pro", id: env.POLAR_PRODUCT_FORMS_PRO },
    { product: "forms", plan: "team", id: env.POLAR_PRODUCT_FORMS_TEAM },
    { product: "catch", plan: "pro", id: env.POLAR_PRODUCT_CATCH_PRO },
    { product: "catch", plan: "team", id: env.POLAR_PRODUCT_CATCH_TEAM },
    { product: "schema", plan: "pro", id: env.POLAR_PRODUCT_SCHEMA_PRO },
    { product: "schema", plan: "team", id: env.POLAR_PRODUCT_SCHEMA_TEAM },
  ];
  return entries.find((e) => e.id === polarProductId) ?? null;
}

export async function createCheckout(
  env: Env,
  product: Product,
  plan: Exclude<Plan, "free">,
  successUrl: string,
  discountCode?: string,
): Promise<{ url: string } | { error: string; status: number }> {
  const productId = productIdFor(env, product, plan);
  if (!env.POLAR_ACCESS_TOKEN || !productId) {
    return {
      error: "Billing is not configured yet. Complete SETUP.md Polar product IDs.",
      status: 503,
    };
  }
  const payload: Record<string, unknown> = {
    products: [productId],
    success_url: successUrl,
  };
  if (discountCode) payload.discount_code = discountCode;
  const res = await fetch(`${POLAR_API}/checkouts/`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${env.POLAR_ACCESS_TOKEN}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    return { error: await res.text(), status: res.status };
  }
  const data = (await res.json()) as { url: string };
  return { url: data.url };
}

export async function createCustomerPortal(
  env: Env,
  customerId: string,
  returnUrl: string,
): Promise<{ url: string } | { error: string; status: number }> {
  if (!env.POLAR_ACCESS_TOKEN) {
    return { error: "Billing is not configured", status: 503 };
  }
  const res = await fetch(`${POLAR_API}/customer-sessions/`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${env.POLAR_ACCESS_TOKEN}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      customer_id: customerId,
      return_url: returnUrl,
    }),
  });
  if (!res.ok) {
    return { error: await res.text(), status: res.status };
  }
  const data = (await res.json()) as { customer_portal_url?: string; customerPortalUrl?: string };
  const url = data.customer_portal_url || data.customerPortalUrl;
  if (!url) return { error: "No portal URL returned", status: 502 };
  return { url };
}

export async function fetchCheckout(env: Env, checkoutId: string): Promise<Record<string, unknown> | null> {
  if (!env.POLAR_ACCESS_TOKEN) return null;
  const res = await fetch(`${POLAR_API}/checkouts/${checkoutId}`, {
    headers: { authorization: `Bearer ${env.POLAR_ACCESS_TOKEN}` },
  });
  if (!res.ok) return null;
  return (await res.json()) as Record<string, unknown>;
}

export async function verifyPolarSignature(
  secret: string,
  headers: Headers,
  body: string,
): Promise<boolean> {
  const id = headers.get("webhook-id");
  const timestamp = headers.get("webhook-timestamp");
  const signatureHeader = headers.get("webhook-signature");
  if (!id || !timestamp || !signatureHeader) return false;

  const age = Math.abs(Date.now() / 1000 - Number(timestamp));
  if (!Number.isFinite(age) || age > 300) return false;

  const encoder = new TextEncoder();
  const keyMaterial: ArrayBuffer[] = [encoder.encode(secret).buffer as ArrayBuffer];
  try {
    const bin = atob(secret);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    keyMaterial.push(bytes.buffer);
  } catch {
    // secret is not base64; raw UTF-8 key is enough
  }

  const message = encoder.encode(`${id}.${timestamp}.${body}`);
  const expected: string[] = [];
  for (const material of keyMaterial) {
    const key = await crypto.subtle.importKey("raw", material, { name: "HMAC", hash: "SHA-256" }, false, [
      "sign",
    ]);
    const sig = await crypto.subtle.sign("HMAC", key, message);
    expected.push(`v1,${btoa(String.fromCharCode(...new Uint8Array(sig)))}`);
  }

  const provided = signatureHeader.split(" ");
  return provided.some((p) => expected.some((e) => timingSafeEqual(p, e)));
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

export async function applySubscriptionGrant(
  env: Env,
  input: {
    email: string;
    polarCustomerId?: string | null;
    polarSubscriptionId?: string | null;
    polarProductId?: string | null;
    status?: string;
    periodEnd?: number | null;
  },
): Promise<{ userId: string; apiKey?: string; claimToken?: string }> {
  const meta = decodeProductMeta(input.polarProductId ?? undefined, env);
  const userId = await ensureUser(env, input.email, input.polarCustomerId);
  if (meta) {
    await env.DB.prepare(
      `INSERT INTO entitlements (user_id, product, plan, polar_subscription_id, polar_product_id, status, current_period_end)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(user_id, product) DO UPDATE SET
         plan = excluded.plan,
         polar_subscription_id = excluded.polar_subscription_id,
         polar_product_id = excluded.polar_product_id,
         status = excluded.status,
         current_period_end = excluded.current_period_end`,
    )
      .bind(
        userId,
        meta.product,
        meta.plan,
        input.polarSubscriptionId ?? null,
        input.polarProductId ?? null,
        input.status ?? "active",
        input.periodEnd ?? null,
      )
      .run();
  }

  const existingKey = await env.DB.prepare(
    `SELECT id FROM api_keys WHERE user_id = ? AND revoked_at IS NULL LIMIT 1`,
  )
    .bind(userId)
    .first();

  let apiKey: string | undefined;
  if (!existingKey) {
    const minted = await mintApiKey(env, userId);
    apiKey = minted.key;
    const token = id("claim");
    await env.DB.prepare(
      `INSERT INTO claims (token, user_id, api_key_plain, created_at) VALUES (?, ?, ?, ?)`,
    )
      .bind(token, userId, minted.key, Date.now())
      .run();
    return { userId, apiKey, claimToken: token };
  }
  return { userId };
}

export async function revokeProduct(env: Env, polarSubscriptionId: string): Promise<void> {
  await env.DB.prepare(
    `UPDATE entitlements SET status = 'revoked' WHERE polar_subscription_id = ?`,
  )
    .bind(polarSubscriptionId)
    .run();
}

export async function claimToken(env: Env, token: string): Promise<{ key: string; email: string } | null> {
  const row = await env.DB.prepare(
    `SELECT c.api_key_plain as key, c.consumed_at, u.email
     FROM claims c JOIN users u ON u.id = c.user_id
     WHERE c.token = ?`,
  )
    .bind(token)
    .first<{ key: string; consumed_at: number | null; email: string }>();
  if (!row || row.consumed_at) return null;
  await env.DB.prepare(`UPDATE claims SET consumed_at = ? WHERE token = ?`).bind(Date.now(), token).run();
  return { key: row.key, email: row.email };
}

export async function hashIp(ip: string): Promise<string> {
  return (await sha256(ip)).slice(0, 24);
}
