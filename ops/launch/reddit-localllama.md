# r/LocalLLaMA — Plinth Schema

## Title

JSON repair + JSON Schema validation as MCP tools (free tier, self-hostable)

## Body

Local and API models often return JSON that is *almost* valid — markdown fences, trailing commas, single-quoted keys, Python `True`/`None`, truncated closing braces. I built [Plinth Schema](https://plinthrun.com/schema) to repair that text and optionally validate the result against a JSON Schema.

**MCP endpoint:** `https://api.plinthrun.com/mcp`

Tools exposed:
- `schema_repair` — input: `{ "text": "..." }` → repaired JSON string
- `schema_repair_and_validate` — input: `{ "text": "...", "schema": { ... } }` → repaired JSON + validation result

Example Cursor config:

```json
{
  "mcpServers": {
    "plinth": {
      "url": "https://api.plinthrun.com/mcp"
    }
  }
}
```

**REST alternative:**

```bash
curl -X POST https://api.plinthrun.com/v1/schema/repair-and-validate \
  -H 'content-type: application/json' \
  -d '{"text":"{ok: True}", "schema":{"type":"object","properties":{"ok":{"type":"boolean"}}}}'
```

**Free tier:** 100 repairs/day, no account required for the on-site bench. Open-source core: `@plinth/schema` on npm; full stack at https://github.com/soulpool90-png/plinth

Useful in agent loops where structured output fails validation and you want a repair step before retrying the model. Docs: https://plinthrun.com/docs/mcp

Happy to hear what repair cases your models still break on.
