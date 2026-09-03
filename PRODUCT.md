# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

delegated: Astro (static marketing, docs, SEO, companion tools) on Cloudflare Pages; Hono APIs on Cloudflare Workers with D1 and KV; Polar as merchant of record. Chosen because the approved plan forbids Vercel Hobby (no commercial use), requires a $0 commercial-capable free tier, and needs a Worker-native API. Package manager: npm workspaces.

## Users

Primary: solo developers and AI-agent builders who need a small piece of infrastructure (a form endpoint, a webhook inbox, valid JSON from a model) without standing up a backend or talking to sales.

Situation: they are shipping a static site, debugging a Stripe/GitHub webhook, or parsing LLM output in a Worker/script, usually at a desk or on a laptop, often after a failure.

Job: get a working URL or API call in minutes, then ignore it until it breaks.

## Product Purpose

Plinth is a portfolio of three self-serve open-core tools under one company:

1. **Forms** — a form backend for static sites.
2. **Catch** — an inspectable webhook inbox with replay.
3. **Schema** — repair and validate JSON (especially LLM output) against a schema.

Success is paying self-serve subscribers (target: $100k ARR / ~$8.3k MRR within 12 months) with almost no founder time after one-time account setup.

## Positioning

Open-source cores you can run yourself; hosted Pro is persistence, keys, replay, team schemas, and higher limits — not a locked black box. One API, one dashboard, three products. Polar is merchant of record so the operator never files sales tax.

## Operating Context

- Discovery: GitHub/npm, docs/SEO, companion tools on the site, directory listings, MCP configs.
- Use: curl, fetch, HTML form `action`, MCP, tiny JS snippet.
- Operate: Cloudflare dashboard + Polar dashboard + this repo. Cursor Automations (daily / growth / weekly / monthly) read `STRATEGY.md` and `ops/log.md`.
- Billing: Polar checkout + customer portal. Entitlements land in D1 via Polar webhooks.

## Capabilities and Constraints

- $0 fixed cost after one ~$12/yr domain until revenue covers upgrades 3x.
- Cloudflare free tier: commercial use allowed; ~100k Worker requests/day.
- No paid ads. No sales calls. Support is email, answered by the daily operator agent.
- Identity, bank KYC, Polar, GitHub, and Cloudflare accounts are human-only; labeled as such in SETUP.md.
- Pricing (planned, Polar products created at setup): Free, Pro $19/mo, Team $49/mo per product. Annual 2 months free.
- Inferred from the approved plan (2026-09-02), not a separate user interview: audience, $0 constraint, Cloudflare+Polar stack, three-MVP portfolio, kill/double-down rules.

Undecided until Polar exists: live product IDs, checkout URLs, webhook secret.

## Brand Commitments

- Name: **Plinth** (the block a column stands on — infrastructure under the thing you actually ship).
- Domain to buy: **plinth.dev**, fallbacks `useplinth.com`, `plinth.run`.
- Voice: precise, slightly dry, no hype, no “AI-powered” as decoration. Commands over adjectives.
- Do not fabricate customers, logos, MRR, or testimonials.

## Evidence on Hand

None. No customers, press, or screenshots of production usage. Companion tools on the site are the live proof. Any dashboard numbers in marketing mockups must be labeled synthetic.

## Product Principles

1. The free path must complete a real job (submit a form, catch a webhook, repair JSON) without an account.
2. Paid is memory, limits, and team — never the first success.
3. Every product has an open-source core published to npm.
4. Kill what does not get a paying customer; double down on the first that does.
5. Do not spend money the product has not earned.

## Accessibility & Inclusion

WCAG 2.2 AA on marketing, docs, and tools. Keyboard-complete companion tools. Do not rely on color alone for valid/invalid JSON or request status.
