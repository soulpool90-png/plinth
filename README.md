# Plinth

Open-core infrastructure for solo builders. Live at [plinthrun.com](https://plinthrun.com).

| Product | Job | Free path |
|---------|-----|-----------|
| **Forms** | Static-site form backend | Mint URL → POST |
| **Catch** | Webhook inbox | Create bin → inspect |
| **Schema** | LLM JSON repair + validate | Browser bench / API / MCP |

[![CI](https://github.com/soulpool90-png/plinth/actions/workflows/ci.yml/badge.svg)](https://github.com/soulpool90-png/plinth/actions)
[![npm @plinth/schema](https://img.shields.io/npm/v/@plinth/schema.svg)](https://www.npmjs.com/package/@plinth/schema)
[![License: MIT](https://img.shields.io/badge/License-MIT-teal.svg)](./LICENSE)

## 60-second demos

**Forms — mint a POST URL**

```bash
curl -X POST https://api.plinthrun.com/v1/forms/anonymous
# → { "action": "https://api.plinthrun.com/v1/forms/frm_…" }
```

**Catch — inspect any webhook**

```bash
curl -X POST https://api.plinthrun.com/v1/catch/bins -H "content-type: application/json" -d "{}"
# → { "url": "https://api.plinthrun.com/v1/catch/bin_…", "inspect": "https://plinthrun.com/catch?bin=…" }
curl -X POST "$CATCH_URL" -H "content-type: application/json" -d '{"hello":"plinth"}'
```

**Schema — repair broken LLM JSON**

```bash
curl -X POST https://api.plinthrun.com/v1/schema/repair \
  -H "content-type: application/json" \
  -d "{\"text\":\"{name: 'Ada', ok: True,}\"}"
```

MCP endpoint for agents: `https://api.plinthrun.com/mcp`

## Packages

```bash
npm i @plinth/schema @plinth/forms @plinth/catch
```

## Monorepo

```
apps/web     Astro marketing + docs + companion tools (Cloudflare)
apps/api     Hono on Cloudflare Workers + D1
packages/*   @plinth/schema, forms, catch, shared
ops/         Automations, distribution, concentration
research/    Product scoring
```

## Local

```bash
npm install
npm test
npm run dev:api   # wrangler → :8787
npm run dev:web   # astro → :4321
```

Set `apps/web` env `PUBLIC_API_URL=http://localhost:8787`.

## Deploy

Follow [SETUP.md](./SETUP.md). Cloudflare Pages / Workers. Polar is merchant of record.

## Strategy

See [STRATEGY.md](./STRATEGY.md). Target: ≥ $100k ARR in 12 months, AI-operated after one-time setup.

## License

MIT
