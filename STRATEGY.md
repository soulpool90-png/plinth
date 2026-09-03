# Strategy

Plinth portfolio · AI-operated · target ≥ $100k ARR within 12 months.

## North star

Maximize net profit under $0 fixed cost (one ~$12/yr domain excepted). Founder time after setup ≈ 0; optional 10-minute human tasks may appear in weekly reports.

## Products

| Product | Job | Free wedge | Paid wedge |
|---------|-----|------------|------------|
| Forms | Static-site form backend | Mint URL, submit, store | Quota, webhooks, retention |
| Catch | Webhook inbox | Create bin, inspect | Private history, replay |
| Schema | LLM JSON repair + validate | Browser bench + API | Saved schemas, high quota |

## Kill / double-down

- **Kill:** 60 days after public launch, zero paying customers AND traffic trend &lt; 500 visits/mo → archive (keep SEO pages pointing to the winner).
- **Double-down:** first product to 5 paying customers gets ≥80% of automation agent time.
- **Reset:** miss a milestone by &gt;50% → monthly review must change the bet, not “try harder.”

## Milestones

| When | Target |
|------|--------|
| Month 3 | First paying customer |
| Month 6 | $1k MRR |
| Month 9 | $4k MRR |
| Month 12 | $8.3k MRR ($100k ARR) |

## Cost rule

Cloudflare free + Polar Starter + Cursor usage inside plan. Upgrade Workers Paid / Cloudflare only when revenue covers the new cost ≥3× for 30 days.

## Distribution (paid ads = never)

1. Open-core npm + GitHub
2. Programmatic SEO (`/compare/*`, `/guides/*`)
3. Companion tools on-site
4. MCP endpoint
5. Directory + awesome-list PRs (see `ops/distribution.md`)
6. Optional human: PH / HN / Reddit posts listed in weekly report

## Operator loop

See `ops/automations/`. All agents read this file and append to `ops/log.md`.

## Current focus

**Live.** https://plinthrun.com · https://api.plinthrun.com · repo `soulpool90-png/plinth`.

Balanced across Forms / Catch / Schema until double-down fires. Priority: first paying customer by month 3 via free-path polish + SEO + Polar checkout working.
