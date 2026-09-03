# SETUP — one-time human checklist (~90 minutes)

Do these in order. After this, Cursor Automations run the business. Paste secrets only into Cloudflare Workers encrypted env / Cursor Cloud Agent secrets — never commit them.

## 0. Tell the agent

Reply in chat with:

1. The GitHub username you will use
2. The email that should receive the weekly report
3. Confirm domain choice: **plinth.dev** (or say you grabbed a fallback: `useplinth.com` / `plinth.run`)

## 1. GitHub (~10 min)

1. Create a free GitHub account if needed.
2. Create a new **private or public** repo named `plinth` (public helps open-core discovery).
3. Install the **Cursor GitHub App** for that repo (Cursor Settings → Integrations / Cloud Agents).
4. Push this monorepo:

```bash
git remote add origin https://github.com/YOUR_USER/plinth.git
git branch -M main
git add -A
git commit -m "Initial Plinth scaffold"
git push -u origin main
```

## 2. Polar (~20 min) — US resident

1. Sign up at [polar.sh](https://polar.sh) with GitHub.
2. Create organization **Plinth**.
3. Complete identity + bank payout (Stripe under the hood).
4. Create six products (recurring):

| Product name | Price |
|--------------|-------|
| Forms Pro | $19/mo · $190/yr |
| Forms Team | $49/mo · $490/yr |
| Catch Pro | $19/mo · $190/yr |
| Catch Team | $49/mo · $490/yr |
| Schema Pro | $19/mo · $190/yr |
| Schema Team | $49/mo · $490/yr |

5. Copy each Product ID (⋮ → Copy Product ID).
6. Create an **Organization Access Token** with `checkouts:write`, `checkouts:read`, `products:read`, `subscriptions:read`, `orders:read`.
7. Apply to the [Polar Startup Program](https://polar.sh/) (Scale free 12 months) — one form.
8. After the API is deployed, add webhook endpoint `https://api.plinth.dev/v1/webhooks/polar` (Raw), subscribe to `order.paid`, `subscription.created`, `subscription.active`, `subscription.canceled`, `subscription.revoked`. Save the signing secret.

## 3. Cloudflare (~25 min)

1. Create a free Cloudflare account.
2. Buy **plinth.dev** (or fallback) on Cloudflare Registrar (~$10–12/yr).
3. Create D1 database named `plinth`. Copy the database id into both `apps/api/wrangler.toml` and `apps/api/wrangler.email.toml` (`database_id`).
4. Apply migrations:

```bash
cd apps/api
npx wrangler d1 migrations apply plinth --remote
```

5. Create API token (Workers Scripts Edit, D1 Edit, Account Analytics Read, Zone DNS Edit for your domain).
6. Deploy API:

```bash
npx wrangler secret put POLAR_ACCESS_TOKEN
npx wrangler secret put POLAR_WEBHOOK_SECRET
npx wrangler secret put POLAR_PRODUCT_FORMS_PRO
# …repeat for all six product IDs
npx wrangler secret put REPORT_EMAIL
npx wrangler deploy
```

7. Attach custom domain `api.plinth.dev` to the Worker.
8. Deploy web:

```bash
cd apps/web
# set PUBLIC_API_URL=https://api.plinth.dev in Pages env
npm run build
npx wrangler pages project create plinth-web
npx wrangler pages deploy dist --project-name=plinth-web
```

9. Attach `plinth.dev` to the Pages project. Set Pages env `PUBLIC_API_URL=https://api.plinth.dev`.
10. Optional: Email Routing → catch-all to Worker `plinth-email` (`wrangler.email.toml`).

## 4. Cursor Automations (~15 min)

1. Enable on-demand billing with a **hard spend cap** you accept (Automations require it).
2. In chat, ask the agent to open the four drafts in `ops/automations/` (or approve the draft tables when presented).
3. In the Automations editor, set **repo** to `YOUR_USER/plinth`, branch `main`.
4. Add Cloud Agent secrets: `CLOUDFLARE_API_TOKEN`, `POLAR_ACCESS_TOKEN`, `REPORT_EMAIL`.

## 5. npm publish (optional, after first deploy)

```bash
# from each packages/{schema,forms,catch}
npm publish --access public
```

Use an npm account. Packages are already named `@plinth/*` — create the npm org `plinth` or rename scopes before publish.

## Done when

- [ ] `https://api.plinth.dev/health` returns ok
- [ ] `https://plinth.dev` loads
- [ ] Polar webhook delivers a test event
- [ ] Four automations show a successful dry run
- [ ] Weekly report email address confirmed
