# Save Cursor Automations (human, ~5 min)

JSON templates in this folder already point at `soulpool90-png/plinth` / `main`.

In https://cursor.com/automations create or edit these four:

| Name | Cron | Prompt file |
|------|------|-------------|
| Plinth Daily Operator | `0 14 * * *` | `ops/automations/daily-operator.md` |
| Plinth Growth | `0 16 * * 1,3,5` | `ops/automations/growth.md` |
| Plinth Weekly Strategist | `0 15 * * 1` | `ops/automations/weekly-strategist.md` |
| Plinth Monthly Portfolio | `0 15 1 * *` | `ops/automations/monthly-portfolio.md` |

For each:
1. Repo: `soulpool90-png/plinth`, branch `main`
2. Cloud Agent secrets: `CLOUDFLARE_API_TOKEN`, `POLAR_ACCESS_TOKEN`, `REPORT_EMAIL`
3. Prefill from the matching `*.workflow.json` if the UI accepts import

Reply with the **REPORT_EMAIL** address once set (still unknown to the agent).

Dry-run: trigger Daily Operator once manually and confirm it can clone the (now public) repo.
