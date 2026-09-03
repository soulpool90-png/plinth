import { Hono } from "hono";
import { repairAndValidate, repairJson, validateJson } from "@plinth/schema";
import { LIMITS } from "@plinth/shared";
import type { Env } from "../env.ts";
import { resolveAuth, consumeQuota } from "../auth.ts";
import { id, json } from "../util.ts";

export const schemaRoutes = new Hono<{ Bindings: Env }>();

schemaRoutes.post("/v1/schema/repair", async (c) => {
  const auth = await resolveAuth(c.env, c.req.raw, "schema");
  const quota = await consumeQuota(c.env, auth, "schema");
  if (!quota.ok) return json({ error: "Quota exceeded", remaining: quota.remaining }, 429);
  const body = (await c.req.json()) as { text?: string };
  if (typeof body.text !== "string") return json({ error: "text required" }, 400);
  const result = repairJson(body.text);
  return json({ ...result, remaining: quota.remaining });
});

schemaRoutes.post("/v1/schema/validate", async (c) => {
  const auth = await resolveAuth(c.env, c.req.raw, "schema");
  const quota = await consumeQuota(c.env, auth, "schema");
  if (!quota.ok) return json({ error: "Quota exceeded", remaining: quota.remaining }, 429);
  const body = (await c.req.json()) as { value?: unknown; schema?: unknown };
  if (body.schema === undefined) return json({ error: "schema required" }, 400);
  return json({ ...validateJson(body.value, body.schema), remaining: quota.remaining });
});

schemaRoutes.post("/v1/schema/repair-and-validate", async (c) => {
  const auth = await resolveAuth(c.env, c.req.raw, "schema");
  const quota = await consumeQuota(c.env, auth, "schema");
  if (!quota.ok) return json({ error: "Quota exceeded", remaining: quota.remaining }, 429);
  const body = (await c.req.json()) as { text?: string; schema?: unknown };
  if (typeof body.text !== "string" || body.schema === undefined) {
    return json({ error: "text and schema required" }, 400);
  }
  return json({ ...repairAndValidate(body.text, body.schema), remaining: quota.remaining });
});

schemaRoutes.post("/v1/schema/saved", async (c) => {
  const auth = await resolveAuth(c.env, c.req.raw, "schema");
  if (!auth.userId) return json({ error: "API key required" }, 401);
  const limits = LIMITS[auth.plan].schema;
  if (limits.resources <= 0) return json({ error: "Saved schemas require Pro" }, 402);
  const count = await c.env.DB.prepare(`SELECT COUNT(*) as n FROM saved_schemas WHERE user_id = ?`)
    .bind(auth.userId)
    .first<{ n: number }>();
  if ((count?.n ?? 0) >= limits.resources) {
    return json({ error: "Saved schema limit reached" }, 402);
  }
  const body = (await c.req.json()) as { name?: string; schema?: unknown };
  if (!body.schema) return json({ error: "schema required" }, 400);
  const schemaId = id("sch");
  await c.env.DB.prepare(
    `INSERT INTO saved_schemas (id, user_id, name, schema_json, created_at) VALUES (?, ?, ?, ?, ?)`,
  )
    .bind(schemaId, auth.userId, body.name ?? "Untitled schema", JSON.stringify(body.schema), Date.now())
    .run();
  return json({ id: schemaId });
});

schemaRoutes.get("/v1/schema/saved", async (c) => {
  const auth = await resolveAuth(c.env, c.req.raw, "schema");
  if (!auth.userId) return json({ error: "API key required" }, 401);
  const rows = await c.env.DB.prepare(
    `SELECT id, name, schema_json, created_at FROM saved_schemas WHERE user_id = ? ORDER BY created_at DESC`,
  )
    .bind(auth.userId)
    .all();
  return json({
    schemas: rows.results?.map((r) => ({
      id: (r as { id: string }).id,
      name: (r as { name: string }).name,
      schema: JSON.parse(String((r as { schema_json: string }).schema_json)),
      created_at: (r as { created_at: number }).created_at,
    })),
  });
});
