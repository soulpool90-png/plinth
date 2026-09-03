# @plinth/schema

Repair malformed JSON (especially LLM output) and validate against JSON Schema.

```bash
npm i @plinth/schema
```

```ts
import { repairJson, repairAndValidate } from "@plinth/schema";

repairJson("{ok: True,}");
repairAndValidate("{email: 'a@b.com'}", {
  type: "object",
  required: ["email"],
  properties: { email: { type: "string", format: "email" } },
});
```

Hosted API: `https://api.plinthrun.com/v1/schema/*` · Site: https://plinthrun.com/schema · MCP: `https://api.plinthrun.com/mcp`

MIT · [GitHub](https://github.com/soulpool90-png/plinth)
