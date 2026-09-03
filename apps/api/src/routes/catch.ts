import { Hono } from "hono";
import { snapshotFromParts } from "@plinth/catch";
import { LIMITS } from "@plinth/shared";
import type { Env } from "../env.ts";
import { resolveAuth, consumeQuota } from "../auth.ts";
import { id, json } from "../util.ts";

export const catchRoutes = new Hono<{ Bindings: Env }>();

catchRoutes.post("/v1/catch/bins", async (c) => {
  const auth = await resolveAuth(c.env, c.req.raw, "catch");
  if (auth.userId) {
    const limits = LIMITS[auth.plan].catch;
    const count = await c.env.DB.prepare(`SELECT COUNT(*) as n FROM catch_bins WHERE user_id = ?`)
      .bind(auth.userId)
      .first<{ n: number }>();
    if ((count?.n ?? 0) >= limits.resources) {
      return json({ error: "Bin limit reached", plan: auth.plan, limit: limits.resources }, 402);
    }
  }
  const body = (await c.req.json().catch(() => ({}))) as { name?: string };
  const binId = id("bin");
  await c.env.DB.prepare(
    `INSERT INTO catch_bins (id, user_id, name, created_at) VALUES (?, ?, ?, ?)`,
  )
    .bind(binId, auth.userId, body.name ?? "Untitled bin", Date.now())
    .run();
  return json({
    id: binId,
    url: `${c.env.API_PUBLIC_URL}/v1/catch/${binId}`,
    inspect: `${c.env.PUBLIC_WEB_URL}/catch?bin=${binId}`,
  });
});

catchRoutes.get("/v1/catch/:binId/events", async (c) => {
  const binId = c.req.param("binId");
  const bin = await c.env.DB.prepare(`SELECT * FROM catch_bins WHERE id = ?`).bind(binId).first<{
    id: string;
    user_id: string | null;
  }>();
  if (!bin) return json({ error: "Unknown bin" }, 404);

  if (bin.user_id) {
    const auth = await resolveAuth(c.env, c.req.raw, "catch");
    const ent = await c.env.DB.prepare(
      `SELECT plan, status FROM entitlements WHERE user_id = ? AND product = 'catch'`,
    )
      .bind(bin.user_id)
      .first<{ plan: string; status: string }>();
    const privateBin = ent?.status === "active" && LIMITS[(ent.plan as "pro" | "team") ?? "free"]?.catch.private;
    if (privateBin && auth.userId !== bin.user_id) {
      return json({ error: "Private bin" }, 403);
    }
  }

  const rows = await c.env.DB.prepare(
    `SELECT id, method, path, headers, body, json, size, created_at
     FROM catch_events WHERE bin_id = ? ORDER BY created_at DESC LIMIT 100`,
  )
    .bind(binId)
    .all();

  return json({
    bin: { id: bin.id },
    events: rows.results?.map((r) => ({
      ...r,
      headers: JSON.parse(String((r as { headers: string }).headers)),
      json: (r as { json: string | null }).json ? JSON.parse(String((r as { json: string }).json)) : null,
    })),
  });
});

catchRoutes.post("/v1/catch/:binId/replay/:eventId", async (c) => {
  const auth = await resolveAuth(c.env, c.req.raw, "catch");
  if (!LIMITS[auth.plan].catch.replay) {
    return json({ error: "Replay requires Pro" }, 402);
  }
  const body = (await c.req.json()) as { url: string };
  if (!body.url) return json({ error: "url required" }, 400);
  const event = await c.env.DB.prepare(`SELECT * FROM catch_events WHERE id = ? AND bin_id = ?`)
    .bind(c.req.param("eventId"), c.req.param("binId"))
    .first<{ method: string; headers: string; body: string | null }>();
  if (!event) return json({ error: "Unknown event" }, 404);
  const headers = JSON.parse(event.headers) as Record<string, string>;
  delete headers["host"];
  delete headers["content-length"];
  const res = await fetch(body.url, {
    method: event.method,
    headers,
    body: event.body ?? undefined,
  });
  return json({ status: res.status, ok: res.ok });
});

catchRoutes.all("/v1/catch/:binId", async (c) => {
  const binId = c.req.param("binId");
  const bin = await c.env.DB.prepare(`SELECT * FROM catch_bins WHERE id = ?`).bind(binId).first<{
    id: string;
    user_id: string | null;
  }>();
  if (!bin) return json({ error: "Unknown bin" }, 404);

  let plan: "free" | "pro" | "team" = "free";
  let keyId = `bin_${binId}`;
  if (bin.user_id) {
    const ent = await c.env.DB.prepare(
      `SELECT plan, status FROM entitlements WHERE user_id = ? AND product = 'catch'`,
    )
      .bind(bin.user_id)
      .first<{ plan: string; status: string }>();
    if (ent?.status === "active" && (ent.plan === "pro" || ent.plan === "team")) plan = ent.plan;
    const key = await c.env.DB.prepare(
      `SELECT id FROM api_keys WHERE user_id = ? AND revoked_at IS NULL LIMIT 1`,
    )
      .bind(bin.user_id)
      .first<{ id: string }>();
    if (key) keyId = key.id;
  }

  const quota = await consumeQuota(c.env, { userId: bin.user_id, keyId, plan }, "catch");
  if (!quota.ok) return json({ error: "Quota exceeded" }, 429);

  const rawBody = await c.req.text();
  const headerMap: Record<string, string> = {};
  c.req.raw.headers.forEach((v, k) => {
    headerMap[k] = v;
  });
  const snap = snapshotFromParts({
    method: c.req.method,
    url: c.req.url,
    headers: headerMap,
    body: rawBody,
  });

  const eventId = id("evt");
  await c.env.DB.prepare(
    `INSERT INTO catch_events (id, bin_id, method, path, headers, body, json, size, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(
      eventId,
      binId,
      snap.method,
      snap.path,
      JSON.stringify(snap.headers),
      snap.body,
      snap.json ? JSON.stringify(snap.json) : null,
      snap.size,
      Date.now(),
    )
    .run();

  // Retention trim
  const keep = LIMITS[plan].catch.retentionDays;
  const cutoff = Date.now() - keep * 86400000;
  c.executionCtx.waitUntil(
    c.env.DB.prepare(`DELETE FROM catch_events WHERE bin_id = ? AND created_at < ?`)
      .bind(binId, cutoff)
      .run()
      .then(() => undefined),
  );

  return json({ ok: true, id: eventId });
});
