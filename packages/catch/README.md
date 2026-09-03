# @plinth/catch

Serialize HTTP requests into inspectable webhook snapshots, with optional header redaction.

```bash
npm i @plinth/catch
```

```ts
import { snapshotFromParts } from "@plinth/catch";

const event = snapshotFromParts({
  method: "POST",
  url: "/hooks",
  headers: { "content-type": "application/json" },
  body: '{"ok":true}',
});
```

Hosted product: https://plinthrun.com/catch · API: `https://api.plinthrun.com/v1/catch`

MIT · [GitHub](https://github.com/soulpool90-png/plinth)
