# Cloudflare Web Analytics (human, ~2 min)

1. Cloudflare Dashboard → Web Analytics → Add site → `plinthrun.com`
2. Copy the beacon token
3. Set Pages/Workers build env `PUBLIC_CF_BEACON=<token>` (or put in `apps/web/.env` for local builds)
4. Redeploy web: `npm run build -w @plinth/web && npm run deploy:web`

`Base.astro` already loads the beacon when `PUBLIC_CF_BEACON` is set.
