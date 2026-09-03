import { Hono } from "hono";
import { repairAndValidate, repairJson } from "@plinth/schema";
import type { Env } from "../env.ts";
import { resolveAuth, consumeQuota } from "../auth.ts";
import { json } from "../util.ts";

/**
 * Minimal JSON-RPC MCP endpoint for agent clients.
 * Tools: schema_repair, schema_repair_and_validate, catch_create_bin
 */
export const mcpRoutes = new Hono<{ Bindings: Env }>();

mcpRoutes.get("/mcp", (c) =>
  json({
    name: "plinth",
    version: "0.1.0",
    tools: [
      {
        name: "schema_repair",
        description: "Repair malformed JSON, especially LLM output",
        input: { text: "string" },
      },
      {
        name: "schema_repair_and_validate",
        description: "Repair JSON then validate against a JSON Schema",
        input: { text: "string", schema: "object" },
      },
      {
        name: "catch_create_bin",
        description: "Create a webhook catch URL",
        input: { name: "string?" },
      },
    ],
  }),
);

mcpRoutes.post("/mcp", async (c) => {
  const body = (await c.req.json()) as {
    method?: string;
    params?: { name?: string; arguments?: Record<string, unknown> };
    id?: string | number | null;
  };

  if (body.method === "tools/list") {
    return json({
      jsonrpc: "2.0",
      id: body.id ?? null,
      result: {
        tools: [
          {
            name: "schema_repair",
            description: "Repair malformed JSON",
            inputSchema: {
              type: "object",
              required: ["text"],
              properties: { text: { type: "string" } },
            },
          },
          {
            name: "schema_repair_and_validate",
            description: "Repair JSON and validate against a schema",
            inputSchema: {
              type: "object",
              required: ["text", "schema"],
              properties: {
                text: { type: "string" },
                schema: { type: "object" },
              },
            },
          },
          {
            name: "catch_create_bin",
            description: "Create a webhook catch URL",
            inputSchema: {
              type: "object",
              properties: { name: { type: "string" } },
            },
          },
        ],
      },
    });
  }

  if (body.method === "tools/call") {
    const name = body.params?.name;
    const args = body.params?.arguments ?? {};
    const auth = await resolveAuth(c.env, c.req.raw, "schema");

    if (name === "schema_repair") {
      const quota = await consumeQuota(c.env, auth, "schema");
      if (!quota.ok) {
        return json({
          jsonrpc: "2.0",
          id: body.id ?? null,
          error: { code: -32000, message: "Quota exceeded" },
        });
      }
      const result = repairJson(String(args.text ?? ""));
      return json({
        jsonrpc: "2.0",
        id: body.id ?? null,
        result: { content: [{ type: "text", text: JSON.stringify(result) }] },
      });
    }

    if (name === "schema_repair_and_validate") {
      const quota = await consumeQuota(c.env, auth, "schema");
      if (!quota.ok) {
        return json({
          jsonrpc: "2.0",
          id: body.id ?? null,
          error: { code: -32000, message: "Quota exceeded" },
        });
      }
      const result = repairAndValidate(String(args.text ?? ""), args.schema);
      return json({
        jsonrpc: "2.0",
        id: body.id ?? null,
        result: { content: [{ type: "text", text: JSON.stringify(result) }] },
      });
    }

    if (name === "catch_create_bin") {
      const res = await fetch(new URL("/v1/catch/bins", c.req.url), {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: c.req.header("authorization") ?? "",
          "x-plinth-key": c.req.header("x-plinth-key") ?? "",
        },
        body: JSON.stringify({ name: args.name }),
      });
      const data = await res.text();
      return json({
        jsonrpc: "2.0",
        id: body.id ?? null,
        result: { content: [{ type: "text", text: data }] },
      });
    }

    return json({
      jsonrpc: "2.0",
      id: body.id ?? null,
      error: { code: -32601, message: `Unknown tool ${name}` },
    });
  }

  return json({
    jsonrpc: "2.0",
    id: body.id ?? null,
    error: { code: -32601, message: `Unknown method ${body.method}` },
  });
});
