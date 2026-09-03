# Research shortlist — Plinth portfolio

Scored 2026-09-02. Rubric 1–5: demand, willingness to pay, Workers free-tier buildability, competition gap, open-core fit. **Pick = average.**

| # | Candidate | Demand | WTP | Build | Gap | OC | Avg | Notes |
|---|-----------|--------|-----|-------|-----|----|-----|-------|
| 1 | Static form backend | 5 | 4 | 5 | 2 | 4 | **4.0** | Formspree/Basin prove WTP; crowded but SEO/undercut works |
| 2 | Webhook request bin | 5 | 5 | 5 | 2 | 3 | **4.0** | Webhook.site $9–27/mo; proven |
| 3 | LLM JSON repair+schema | 4 | 4 | 5 | 4 | 5 | **4.4** | jsonrepair lib ≠ hosted+validate+MCP |
| 4 | HTML/URL→Markdown | 5 | 4 | 4 | 1 | 3 | 3.4 | Jina/Firecrawl dominate |
| 5 | OG image API | 4 | 3 | 2 | 2 | 3 | 2.8 | Rendering hard on free Workers |
| 6 | Screenshot API | 4 | 4 | 1 | 1 | 2 | 2.4 | Needs browser rendering (paid) |
| 7 | Uptime monitor | 4 | 3 | 3 | 1 | 3 | 2.8 | Commodity |
| 8 | Status page | 3 | 3 | 4 | 1 | 3 | 2.8 | Instatus et al. |
| 9 | Feature flags | 4 | 4 | 4 | 1 | 3 | 3.2 | LaunchDarkly/PostHog |
| 10 | Changelog widget | 3 | 3 | 4 | 2 | 3 | 3.0 | Crowded |
| 11 | Waitlist tool | 3 | 2 | 5 | 2 | 3 | 3.0 | Weak WTP |
| 12 | Email verification | 4 | 3 | 3 | 1 | 2 | 2.6 | Kickbox/Abstract |
| 13 | Cron→webhook | 4 | 3 | 4 | 2 | 3 | 3.2 | easycron |
| 14 | Token/cost counter | 3 | 2 | 5 | 3 | 4 | 3.4 | Weak standalone WTP |
| 15 | llms.txt host | 3 | 2 | 5 | 3 | 4 | 3.4 | Too thin alone |
| 16 | Prompt versioning | 4 | 4 | 3 | 1 | 2 | 2.8 | LangSmith |
| 17 | MCP hosting | 4 | 4 | 2 | 3 | 3 | 3.2 | Ops heavy |
| 18 | Link unfurl API | 3 | 3 | 4 | 2 | 3 | 3.0 | Microlink |
| 19 | PDF generation | 4 | 3 | 1 | 1 | 2 | 2.2 | Not Workers-friendly |
| 20 | QR code API | 2 | 1 | 5 | 1 | 3 | 2.4 | Commodity |
| 21 | IP geolocation | 3 | 2 | 3 | 1 | 2 | 2.2 | Commodity |
| 22 | Feedback widget | 3 | 3 | 4 | 2 | 3 | 3.0 | Crowded |
| 23 | Docs search API | 3 | 3 | 3 | 2 | 3 | 2.8 | Algolia/Meilisearch |
| 24 | Env/secrets sync | 3 | 3 | 3 | 2 | 2 | 2.6 | Doppler |

## Chosen bets

1. **Schema** (avg 4.4) — highest gap × open-core; agent-native distribution via MCP.
2. **Forms** (avg 4.0) — proven category, SEO “alternative” pages, static-site wedge.
3. **Catch** (avg 4.0) — proven WTP ladder; complements Forms for builders.

## Brand / domain

- **Plinth** — block a column stands on.
- Primary buy: **plinth.dev**
- Fallbacks: `useplinth.com`, `plinth.run`

## Rejected despite hype

HTML→MD and scraping APIs lose to Jina/Firecrawl on free. Screenshot/PDF need paid compute. Feature flags and prompt ops lose to incumbents with sales teams.
