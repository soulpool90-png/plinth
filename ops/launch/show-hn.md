# Show HN — Plinth

## Title

Show HN: Plinth – JSON Schema repair via MCP (and form backends for static sites)

## Body

Hi HN — I built [Plinth](https://plinthrun.com), a small open-core toolkit for solo developers. Three products under one API:

1. **Schema** — repair malformed JSON (especially LLM output), then validate against JSON Schema. Available as REST and as MCP tools at `https://api.plinthrun.com/mcp` (`schema_repair`, `schema_repair_and_validate`). Useful when a model returns fences, trailing commas, single quotes, or truncated braces.
2. **Forms** — a POST URL for static sites. Point your HTML `action` at Plinth; we screen spam, store submissions, and optionally forward via webhook on Pro.
3. **Catch** — a webhook inbox. Mint a URL, point Stripe/GitHub/your service at it, inspect payloads, replay on Pro.

**Why I built it:** I kept hitting the same three gaps — a form endpoint for Astro/Hugo sites, a webhook bin for debugging integrations, and a JSON repair step in agent loops. Rather than three separate SaaS accounts, I wanted one stack I could self-host or pay for hosted persistence.

**Free tier:** Each product works without an account for the first success (50 form submissions/mo, 50 catch events, 100 schema repairs/day). Open-source cores on npm (`@plinth/schema`, `@plinth/forms`, `@plinth/catch`). Source: https://github.com/soulpool90-png/plinth

**Stack:** Astro marketing site on Cloudflare Pages; Hono API on Workers with D1/KV; Polar for billing.

**Try it:**
- Schema bench (no account): https://plinthrun.com/schema
- Mint a form: https://plinthrun.com/forms
- Create a catch bin: https://plinthrun.com/catch
- MCP docs: https://plinthrun.com/docs/mcp

Pro is $19/mo per product if you need webhooks, private bins, replay, saved schemas, or higher quotas. Happy to answer questions about the repair heuristics, the open-core split, or the Cloudflare architecture.
