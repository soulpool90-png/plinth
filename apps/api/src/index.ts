import { Hono } from "hono";
import type { Env } from "./env.ts";
import { corsHeaders, json } from "./util.ts";
import { formsRoutes } from "./routes/forms.ts";
import { catchRoutes } from "./routes/catch.ts";
import { schemaRoutes } from "./routes/schema.ts";
import { billingRoutes } from "./routes/billing.ts";
import { supportRoutes } from "./routes/support.ts";
import { mcpRoutes } from "./routes/mcp.ts";

const app = new Hono<{ Bindings: Env }>();

app.use("*", async (c, next) => {
  if (c.req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders(c.req.header("origin") ?? null, c.env.PUBLIC_WEB_URL),
    });
  }
  await next();
  const headers = corsHeaders(c.req.header("origin") ?? null, c.env.PUBLIC_WEB_URL);
  for (const [k, v] of Object.entries(headers)) c.header(k, String(v));
});

app.get("/", (c) =>
  json({
    name: "plinth-api",
    products: ["forms", "catch", "schema"],
    docs: `${c.env.PUBLIC_WEB_URL}/docs`,
    health: "/health",
  }),
);

app.get("/health", (c) => json({ ok: true, ts: Date.now() }));

app.route("/", formsRoutes);
app.route("/", catchRoutes);
app.route("/", schemaRoutes);
app.route("/", billingRoutes);
app.route("/", supportRoutes);
app.route("/", mcpRoutes);

app.onError((err, c) => {
  const status = (err as Error & { status?: number }).status ?? 500;
  return json({ error: err.message || "Internal error" }, status);
});

export default app;
