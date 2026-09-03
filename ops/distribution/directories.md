# General directory listings — Plinth

Ready-to-paste drafts for product directories and awesome lists.

**Canonical links**
- Site: https://plinthrun.com
- API: https://api.plinthrun.com
- GitHub: https://github.com/soulpool90-png/plinth
- npm: `@plinth/forms`, `@plinth/catch`, `@plinth/schema`

---

## AlternativeTo

Submit three separate entries (or one parent + three features) as appropriate for their UI.

### Plinth Forms (vs Formspree)

**Name:** Plinth Forms

**URL:** https://plinthrun.com/forms

**Category:** Form Builders / Static Site Tools

**Short description:**

Open-core form backend for static sites. POST URL, spam screening, submission storage, optional webhooks.

**Long description:**

Plinth Forms gives static sites (Astro, Hugo, 11ty, plain HTML) a form `action` URL without a custom server. Create an endpoint, paste the snippet, collect submissions. Honeypot spam screening included. Free tier: 50 submissions/month, no account required to start. Pro adds webhooks, longer retention, and higher quotas. Open-source core on npm (`@plinth/forms`); self-host on Cloudflare Workers or use hosted API.

**Alternatives / compared to:** Formspree, Netlify Forms, Getform

**License:** Open-core (hosted + self-host)

**Pricing:** Free tier; Pro $19/mo

---

### Plinth Catch (vs Webhook.site)

**Name:** Plinth Catch

**URL:** https://plinthrun.com/catch

**Category:** Webhook Testing / API Tools

**Short description:**

Webhook request bin with inspect UI. Free public bins; Pro adds privacy, history, and replay.

**Long description:**

Mint a catch URL, point any HTTP client or webhook provider at it, inspect headers and body in a readable UI. Free bins rotate after 24 hours. Pro keeps history 30 days, supports private bins, and can replay events to your local handler. Open-core (`@plinth/catch`).

**Alternatives / compared to:** Webhook.site, Hookbin, RequestBin

**Pricing:** Free tier; Pro $19/mo

---

### Plinth Schema

**Name:** Plinth Schema

**URL:** https://plinthrun.com/schema

**Category:** Developer Tools / JSON

**Short description:**

Repair malformed JSON from LLMs, validate against JSON Schema. REST API and MCP tools.

**Long description:**

Fixes common LLM JSON issues (fences, trailing commas, single quotes, Python literals, truncated braces) then validates against JSON Schema. Available via REST and MCP at `https://api.plinthrun.com/mcp`. Open-source `@plinth/schema`.

**Pricing:** Free tier (100 repairs/day); Pro $19/mo

---

## SaaSHub

**Product name:** Plinth

**Website:** https://plinthrun.com

**Tagline:**

Open-core Forms, Catch, and Schema for solo developers.

**Description:**

Plinth is three self-serve developer tools under one API:

- **Forms** — form backend for static sites (Formspree-style)
- **Catch** — webhook inbox with inspect and replay (Webhook.site-style)
- **Schema** — JSON repair and JSON Schema validation for LLM output, including MCP tools

Free tier on each product; no account required for first success. Open-source cores on npm; hosted Pro adds persistence, webhooks, private resources, and higher limits. Built on Cloudflare Workers; billing via Polar.

**Categories:** Developer Tools, Forms, Webhooks, API

**Pricing model:** Freemium

**Founded / launched:** 2026

**Alternatives:** Formspree, Webhook.site, jsonrepair

---

## Indie Hackers — Product page

**Product name:** Plinth

**URL:** https://plinthrun.com

**Elevator pitch:**

Three open-core dev tools (forms, webhooks, JSON repair) on one Cloudflare stack — free to start, Pro when you need memory.

**What it does:**

Plinth ships Forms (static site form backend), Catch (webhook request bin), and Schema (LLM JSON repair + validation). Each has a free quota, open-source npm package, and a $19/mo Pro tier for webhooks, replay, saved schemas, and higher limits.

**Who it's for:**

Solo developers shipping static sites, debugging Stripe/GitHub webhooks, or parsing structured LLM output in scripts and agents.

**Tech stack:**

Astro on Cloudflare Pages, Hono on Workers, D1/KV, Polar for MoR billing.

**Business model:**

Self-serve subscriptions per product. No sales calls. Target: paying subscribers on the first product that gets traction.

**Open source:**

https://github.com/soulpool90-png/plinth — cores published to npm; hosted API is the convenience layer.

**Ask / discussion prompt:**

Which of the three would you pay for first — forms, webhook debugging, or JSON repair in agent loops?

---

## Product Hunt — Upcoming / launch day

**Name:** Plinth

**Tagline:**

Forms, webhooks, and JSON repair — open-core tools on one API

**Description:**

Plinth is a portfolio of three developer tools for people who do not want to stand up a backend:

1. **Forms** — POST URL for static sites. Spam screening, storage, webhooks on Pro.
2. **Catch** — Webhook inbox. Inspect payloads; replay on Pro.
3. **Schema** — Repair malformed LLM JSON, validate against JSON Schema. REST + MCP.

Free tier on each. Open-source cores (`@plinth/forms`, `@plinth/catch`, `@plinth/schema`). Self-host or use https://api.plinthrun.com.

**First comment (maker):**

Built this because I kept needing a form endpoint, a webhook bin, and a JSON repair step in separate tabs. One Cloudflare stack, one dashboard, three products. Happy to answer questions about the open-core split or MCP integration.

**Links:**
- https://plinthrun.com
- https://github.com/soulpool90-png/plinth
- https://plinthrun.com/docs/mcp

**Topics:** Developer Tools, Open Source, SaaS

---

## Awesome-list PR drafts

### awesome-static-website-services

**PR title:** Add Plinth Forms

**PR body:**

## Why

Plinth Forms is an open-core form backend for static sites — POST URL, honeypot spam screening, optional webhooks. Free tier without signup.

## Link

https://plinthrun.com/forms

**README line:**

```markdown
- [Plinth Forms](https://plinthrun.com/forms) - Open-core form backend for static sites (Astro, Hugo, 11ty). Free tier; self-host via `@plinth/forms` or use hosted API.
```

---

### awesome-webhooks

**PR title:** Add Plinth Catch

**PR body:**

## Why

Plinth Catch is an open-core webhook request bin: mint a URL, inspect payloads, replay on Pro. Alternative to Webhook.site with a self-host path.

## Link

https://plinthrun.com/catch

**README line:**

```markdown
- [Plinth Catch](https://plinthrun.com/catch) - Webhook inbox with inspect UI and replay (Pro). Open-core `@plinth/catch`; hosted bins at api.plinthrun.com.
```

---

### awesome-cloudflare

**PR title:** Add Plinth — Workers + Pages open-core dev tools

**PR body:**

## Why

Plinth is a reference stack for solo SaaS on Cloudflare: Astro marketing site on Pages, Hono API on Workers, D1/KV, Polar billing. Three products (Forms, Catch, Schema) with open-source npm cores.

## Links

- https://plinthrun.com
- https://github.com/soulpool90-png/plinth

**README line:**

```markdown
- [Plinth](https://plinthrun.com) - Open-core Forms/Catch/Schema toolkit on Cloudflare Workers + Pages (Hono, D1, KV). Example of $0-tier commercial Workers SaaS.
```

---

### awesome-json

**PR title:** Add Plinth Schema — LLM JSON repair and validation

**PR body:**

## Why

Plinth Schema repairs malformed JSON (fences, trailing commas, Python literals, truncated objects) and validates against JSON Schema. REST API + MCP tools; open-source `@plinth/schema`.

## Links

- https://plinthrun.com/schema
- MCP: https://api.plinthrun.com/mcp

**README line:**

```markdown
- [Plinth Schema](https://plinthrun.com/schema) - Repair malformed JSON (especially LLM output) and validate against JSON Schema. npm: `@plinth/schema`; MCP: `schema_repair`, `schema_repair_and_validate`.
```
