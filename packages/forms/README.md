# @plinth/forms

Parse and screen HTML form submissions (honeypot, empty body, basic heuristics) for static-site backends.

```bash
npm i @plinth/forms
```

```ts
import { parseFormBody, screenSubmission } from "@plinth/forms";

const fields = parseFormBody(rawBody, contentType);
const verdict = screenSubmission(fields, { honeypot: "_gotcha" });
```

Hosted product: https://plinthrun.com/forms · API: `https://api.plinthrun.com/v1/forms`

MIT · [GitHub](https://github.com/soulpool90-png/plinth)
