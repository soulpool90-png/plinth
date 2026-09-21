# Ops log

## 2026-09-21 — weekly strategist

Scores (paying / traffic / support): Forms unknown/unknown/unknown; Catch unknown/unknown/unknown; Schema unknown/unknown/unknown — `POLAR_ACCESS_TOKEN` and CF analytics still unset in agent env; support `GET /v1/support/open` → 403. Live probes: Catch free bin create OK; Forms create → API key required; Schema repair → 429 quota (upgrade_url present). Milestone Month 3 (first payer; go-live 2026-09-03) not due; no >50% miss → no strategy reset.

Experiments (≤3): (1) Forms free-path: restore/clarify mint-URL without key; (2) pricing free→Pro one-line contrast above buy buttons; (3) Schema post-repair claim-key nudge (quota 429 confirms free-path friction).

Email: not sent — `REPORT_EMAIL` unset; no mail action on this automation. Report below + PR is delivery.

```
MRR / paying: unknown — needs Polar
Product leader: Schema (shortlist + hero; $0 known payers → no double-down)
Shipped last week: nothing on main (Sep 7 & Sep 14 strategist PRs still draft; night ridge remains latest ship)
Ships this week: Forms free-path mint clarity; pricing free→Pro contrast; Schema claim-key nudge
Human: (1) set REPORT_EMAIL+POLAR_ACCESS_TOKEN on Weekly Strategist ≤5m (2) Polar PLINTHTEST checkout proof ≤5m (`ops/checkout-proof.md`)
```

## 2026-09-03 — night ridge redesign

- Replaced cathode-orange world with brief-pinned night ridge (graphite/snow/stone/mist, ink mountain hero).
- SchemaBench sits on the ridge in first viewport; six pricing buy buttons (Pro snow / Team stone outline).
- DESIGN.md rewritten; landing surface brief written; deployed to plinthrun.com.

## 2026-09-03 — first revenue sprint

- All 6 Polar checkouts return live URLs.
- Portal endpoint `POST /v1/portal` + Account UI; upgrade_url on 402/429; Pro CTAs on Forms/Catch/Schema; `/pricing?product=`.
- Repo **public** with topics; README curl demos; packages npm-ready (`ops/npm-publish.md`).
- Web Analytics beacon wired behind `PUBLIC_CF_BEACON` (`ops/web-analytics.md`).
- Guides: 24 long-form pages live at /guides.
- Launch drafts: `ops/launch/*`. Distribution drafts: `ops/distribution/*`.
- awesome-mcp-servers PR: https://github.com/punkpeye/awesome-mcp-servers/pull/13536
- Automations JSON → `soulpool90-png/plinth`; save via `ops/automations/SAVE.md` (need REPORT_EMAIL).
- Human remaining: Polar 100% discount e2e (`ops/checkout-proof.md`), npm login+publish, CF beacon token, paste launch posts, confirm REPORT_EMAIL + 4 automations.

## 2026-09-03 — go-live

- Domain: plinthrun.com (api.plinthrun.com healthy).
- API smoke: Catch bins + Forms anonymous OK.
- Apex was serving Cloudflare "Coming Soon" via empty plinth-site assets; rebuilt+redeployed with PUBLIC_API_URL.
- Pages also at https://plinth-web.pages.dev
- Repo: github.com/soulpool90-png/plinth
- Next: Polar products/webhook if not done; save 4 Cursor Automations with repo soulpool90-png/plinth; weekly report email.

