import type { Env } from "./env.ts";
import { id } from "./util.ts";

export default {
  async email(message: ForwardableEmailMessage, env: Env): Promise<void> {
    const raw = await new Response(message.raw).text();
    const ticketId = id("tkt");
    await env.DB.prepare(
      `INSERT INTO support_tickets (id, from_email, subject, body, status, created_at)
       VALUES (?, ?, ?, ?, 'open', ?)`,
    )
      .bind(
        ticketId,
        message.from,
        message.headers.get("subject") ?? "Email support",
        raw.slice(0, 50_000),
        Date.now(),
      )
      .run();
  },
};
