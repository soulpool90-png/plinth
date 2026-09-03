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

Hosted API: `https://api.plinth.dev/v1/schema/*` · Site: https://plinth.dev/schema
