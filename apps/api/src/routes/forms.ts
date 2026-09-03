import { Hono } from "hono";
import { parseFormBody, screenSubmission } from "@plinth/forms";
import { LIMITS } from "@plinth/shared";
import type { Env } from "../env.ts";
import { resolveAuth, consumeQuota } from "../auth.ts";
import { hashIp } from "../polar.ts";
import { id, json } from "../util.ts";

export const formsRoutes = new Hono<{ Bindings: Env }>();

formsRoutes.post("/v1/forms", async (c) => {
  const auth = await resolveAuth(c.env, c.req.raw, "forms");
  if (!auth.userId) return json({ error: "API key required to create a form" }, 401);
  const limits = LIMITS[auth.plan].forms;
  const count = await c.env.DB.prepare(`SELECT COUNT(*) as n FROM forms WHERE user_id = ?`)
    .bind(auth.userId)
    .first<{ n: number }>();
  if ((count?.n ?? 0) >= limits.resources) {
    return json({ error: "Form limit reached for your plan", plan: auth.plan, limit: limits.resources }, 402);
  }
  const body = (await c.req.json().catch(() => ({}))) as {
    name?: string;
    notify_email?: string;
    honeypot?: string;
    redirect_url?: string;
    webhook_url?: string;
  };
  const formId = id("frm");
  await c.env.DB.prepare(
    `INSERT INTO forms (id, user_id, name, notify_email, honeypot, redirect_url, webhook_url, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(
      formId,
      auth.userId,
      body.name ?? "Untitled form",
      body.notify_email ?? auth.email ?? null,
      body.honeypot ?? "_gotcha",
      body.redirect_url ?? null,
      limits.webhooks ? body.webhook_url ?? null : null,
      Date.now(),
    )
    .run();
  return json({
    id: formId,
    action: `${c.env.API_PUBLIC_URL}/v1/forms/${formId}`,
  });
});

formsRoutes.post("/v1/forms/anonymous", async (c) => {
  const formId = id("frm");
  await c.env.DB.prepare(
    `INSERT INTO forms (id, user_id, name, notify_email, honeypot, redirect_url, webhook_url, created_at)
     VALUES (?, NULL, ?, NULL, '_gotcha', NULL, NULL, ?)`,
  )
    .bind(formId, "Anonymous form", Date.now())
    .run();
  return json({
    id: formId,
    action: `${c.env.API_PUBLIC_URL}/v1/forms/${formId}`,
    note: "Anonymous forms keep submissions for 24 hours and are public via the form id.",
  });
});

formsRoutes.all("/v1/forms/:formId", async (c) => {
  const formId = c.req.param("formId");
  const form = await c.env.DB.prepare(`SELECT * FROM forms WHERE id = ?`)
    .bind(formId)
    .first<{
      id: string;
      user_id: string | null;
      honeypot: string;
      redirect_url: string | null;
      webhook_url: string | null;
      notify_email: string | null;
    }>();
  if (!form) return json({ error: "Unknown form" }, 404);

  if (c.req.method === "GET") {
    const auth = await resolveAuth(c.env, c.req.raw, "forms");
    if (form.user_id && form.user_id !== auth.userId) {
      return json({ error: "Forbidden" }, 403);
    }
    const rows = await c.env.DB.prepare(
      `SELECT id, payload, created_at FROM form_submissions WHERE form_id = ? ORDER BY created_at DESC LIMIT 100`,
    )
      .bind(formId)
      .all();
    return json({ form: { id: form.id }, submissions: rows.results });
  }

  if (c.req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const auth = await resolveAuth(c.env, c.req.raw, "forms");
  if (form.user_id) {
    const ownerKey = await c.env.DB.prepare(
      `SELECT id FROM api_keys WHERE user_id = ? AND revoked_at IS NULL LIMIT 1`,
    )
      .bind(form.user_id)
      .first<{ id: string }>();
    const quotaAuth = ownerKey
      ? { userId: form.user_id, keyId: ownerKey.id, plan: auth.plan }
      : auth;
    // Prefer owner entitlement plan
    const ent = await c.env.DB.prepare(
      `SELECT plan, status FROM entitlements WHERE user_id = ? AND product = 'forms'`,
    )
      .bind(form.user_id)
      .first<{ plan: string; status: string }>();
    const plan =
      ent?.status === "active" && (ent.plan === "pro" || ent.plan === "team") ? ent.plan : "free";
    const quota = await consumeQuota(c.env, { ...quotaAuth, plan }, "forms");
    if (!quota.ok) return json({ error: "Quota exceeded", remaining: quota.remaining }, 429);
  } else {
    const quota = await consumeQuota(c.env, auth, "forms");
    if (!quota.ok) return json({ error: "Quota exceeded", remaining: quota.remaining }, 429);
  }

  const raw = await c.req.text();
  const fields = parseFormBody(c.req.header("content-type") ?? null, raw);
  const startedAt = Number(fields._started_at || 0) || undefined;
  const screened = screenSubmission({
    fields,
    honeypot: form.honeypot,
    startedAt,
    receivedAt: Date.now(),
    userAgent: c.req.header("user-agent") ?? undefined,
  });

  if (!screened.ok) {
    return json({ ok: false, spam: true, reasons: screened.reasons }, 422);
  }

  const submissionId = id("sub");
  const ip = c.req.header("cf-connecting-ip") || "";
  await c.env.DB.prepare(
    `INSERT INTO form_submissions (id, form_id, payload, ip_hash, created_at) VALUES (?, ?, ?, ?, ?)`,
  )
    .bind(submissionId, formId, JSON.stringify(screened.payload), await hashIp(ip), Date.now())
    .run();

  if (form.webhook_url) {
    c.executionCtx.waitUntil(
      fetch(form.webhook_url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          form_id: formId,
          submission_id: submissionId,
          data: screened.payload,
        }),
      }).catch(() => undefined),
    );
  }

  if (form.redirect_url) {
    return c.redirect(form.redirect_url, 303);
  }

  const wantsHtml = (c.req.header("accept") ?? "").includes("text/html");
  if (wantsHtml) {
    return c.html(
      `<!doctype html><html><body style="font-family:system-ui;padding:2rem"><h1>Received</h1><p>Submission ${submissionId}</p><p><a href="${c.env.PUBLIC_WEB_URL}/forms">Back to Plinth Forms</a></p></body></html>`,
    );
  }
  return json({ ok: true, id: submissionId });
});
