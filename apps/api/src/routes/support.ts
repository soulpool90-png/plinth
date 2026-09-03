import { Hono } from "hono";
import type { Env } from "../env.ts";
import { id, json } from "../util.ts";

export const supportRoutes = new Hono<{ Bindings: Env }>();

supportRoutes.post("/v1/support", async (c) => {
  const body = (await c.req.json()) as { email?: string; subject?: string; body?: string };
  if (!body.email || !body.body) return json({ error: "email and body required" }, 400);
  const ticketId = id("tkt");
  await c.env.DB.prepare(
    `INSERT INTO support_tickets (id, from_email, subject, body, status, created_at)
     VALUES (?, ?, ?, ?, 'open', ?)`,
  )
    .bind(ticketId, body.email.toLowerCase(), body.subject ?? "Support", body.body, Date.now())
    .run();
  return json({ ok: true, id: ticketId });
});

supportRoutes.get("/v1/support/open", async (c) => {
  const secret = c.req.header("x-plinth-ops");
  if (!secret || !c.env.POLAR_ACCESS_TOKEN || secret !== c.env.POLAR_ACCESS_TOKEN) {
    return json({ error: "Forbidden" }, 403);
  }
  const rows = await c.env.DB.prepare(
    `SELECT id, from_email, subject, body, created_at FROM support_tickets WHERE status = 'open' ORDER BY created_at ASC LIMIT 50`,
  ).all();
  return json({ tickets: rows.results ?? [] });
});

supportRoutes.post("/v1/support/:id/close", async (c) => {
  const secret = c.req.header("x-plinth-ops");
  if (!secret || !c.env.POLAR_ACCESS_TOKEN || secret !== c.env.POLAR_ACCESS_TOKEN) {
    return json({ error: "Forbidden" }, 403);
  }
  await c.env.DB.prepare(`UPDATE support_tickets SET status = 'answered' WHERE id = ?`)
    .bind(c.req.param("id"))
    .run();
  return json({ ok: true });
});
