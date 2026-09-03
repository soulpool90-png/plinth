# MCP directory submissions — Plinth Schema

Use these as copy-paste drafts. Adjust category/tags per site UI.

**Common fields**
- Name: Plinth Schema
- Endpoint: `https://api.plinthrun.com/mcp`
- Homepage: https://plinthrun.com/schema
- Transport: HTTP (JSON-RPC)
- Auth: none required for free tier (API key optional for higher quotas)

**Tools**
- `schema_repair` — repair malformed JSON text (fences, trailing commas, single quotes, Python literals, truncated braces). Input: `{ "text": string }`.
- `schema_repair_and_validate` — repair then validate against a JSON Schema. Input: `{ "text": string, "schema": object }`.
- `catch_create_bin` — create a webhook catch URL (secondary; Schema is the primary listing).

---

## mcp.so

**Name:** Plinth Schema

**URL:** https://api.plinthrun.com/mcp

**Description:**

Repair malformed JSON from LLM output, then optionally validate against JSON Schema. Exposes `schema_repair` and `schema_repair_and_validate` over HTTP MCP. Free tier: 100 repairs/day. Open-source core (`@plinth/schema`); self-host or use hosted API. Docs: https://plinthrun.com/docs/mcp

**Tags:** json, schema, validation, llm, structured-output

**Homepage:** https://plinthrun.com/schema

---

## Smithery

**Server name:** plinth-schema

**Server URL:** https://api.plinthrun.com/mcp

**Description:**

Plinth Schema repairs broken JSON (markdown fences, trailing commas, single quotes, Python True/None, truncated objects) and validates the result against JSON Schema. Built for agent loops where structured output fails parsing. Tools: `schema_repair`, `schema_repair_and_validate`. Open-core; npm package `@plinth/schema`. Free hosted tier available.

**Repository:** https://github.com/soulpool90-png/plinth

**Documentation:** https://plinthrun.com/docs/mcp

---

## Glama

**Title:** Plinth Schema

**Endpoint:** https://api.plinthrun.com/mcp

**Short description:**

JSON repair and JSON Schema validation for LLM agents.

**Long description:**

Plinth Schema fixes common LLM JSON failures — code fences, trailing commas, single-quoted keys, Python booleans, truncated braces — then validates against a JSON Schema you provide. Call `schema_repair` for text-only repair or `schema_repair_and_validate` when you need schema conformance. HTTP MCP endpoint, no install. Open-source Worker stack; free tier with daily quota. Homepage: https://plinthrun.com/schema

**Categories:** Developer Tools, Data Validation

---

## PulseMCP

**Name:** Plinth Schema

**MCP URL:** https://api.plinthrun.com/mcp

**Website:** https://plinthrun.com/schema

**Summary:**

Hosted MCP tools for repairing and validating JSON from language models.

**Details:**

Plinth exposes `schema_repair` and `schema_repair_and_validate` at a public HTTP endpoint. Point Cursor, Claude Desktop, or any MCP client at `https://api.plinthrun.com/mcp`. Designed for structured-output pipelines where the model returns almost-valid JSON. Self-hostable via https://github.com/soulpool90-png/plinth or use the free hosted quota (100 repairs/day).

---

## awesome-mcp-servers (GitHub PR)

**PR title:** Add Plinth Schema — JSON repair and validation MCP

**PR body:**

## Summary

Adds [Plinth Schema](https://plinthrun.com/schema), an HTTP MCP server for repairing malformed JSON (especially LLM output) and validating against JSON Schema.

## Endpoint

`https://api.plinthrun.com/mcp`

## Tools

- `schema_repair` — repair malformed JSON text
- `schema_repair_and_validate` — repair + JSON Schema validation
- `catch_create_bin` — create webhook catch URL (bonus tool on same endpoint)

## Why include

Useful for agent developers who need a hosted repair step when structured output fails parsing. Open-source (`@plinth/schema` on npm); free tier available.

## Links

- Homepage: https://plinthrun.com/schema
- Docs: https://plinthrun.com/docs/mcp
- Source: https://github.com/soulpool90-png/plinth

**Suggested README line** (place in the appropriate category, e.g. Developer Tools or Data):

```markdown
- [Plinth Schema](https://plinthrun.com/schema) - Repair malformed JSON from LLMs and validate against JSON Schema (`schema_repair`, `schema_repair_and_validate`). HTTP endpoint: `https://api.plinthrun.com/mcp`.
```
