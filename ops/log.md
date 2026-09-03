# Ops log

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

