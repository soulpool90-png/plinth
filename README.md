# Plinth

Open-core infrastructure for solo builders.

| Product | Job | Free path |
|---------|-----|-----------|
| **Forms** | Static-site form backend | Mint URL → POST |
| **Catch** | Webhook inbox | Create bin → inspect |
| **Schema** | LLM JSON repair + validate | Browser bench / API / MCP |

## Monorepo

```
apps/web     Astro marketing + docs + companion tools (Cloudflare Pages)
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

Follow [SETUP.md](./SETUP.md). Do not use Vercel Hobby — commercial use is forbidden there; Cloudflare Pages allows it.

## Strategy

See [STRATEGY.md](./STRATEGY.md). Target: ≥ $100k ARR in 12 months, AI-operated after one-time setup.

## License

MIT
