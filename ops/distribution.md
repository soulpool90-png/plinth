# Distribution engine

Run from the Growth automation (3×/week). Prefer PRs and commits over social posting.

## Every growth run

1. Read `STRATEGY.md` and `ops/log.md`.
2. Check which product is the current double-down target (or “balanced” if none).
3. Ship **one** of:
   - New `/guides/*` or `/compare/*` page targeting a real query
   - Docs improvement with a curl example that works
   - npm package README + version bump if code changed
   - MCP tool description improvement
4. Append what you did to `ops/log.md`.
5. Open a PR if on a feature branch; merge only if CI green and change is safe.

## Directory list (submit once each)

- [ ] Product Hunt (optional human)
- [ ] Hacker News Show HN (optional human)
- [ ] Indie Hackers
- [ ] Awesome static website / awesome webhooks / awesome mcp lists
- [ ] Tool directories: AlternativeTo, SaaSHub, There's An AI For That (Schema only)
- [ ] Cloudflare Built With / Workers examples (if eligible)

## Awesome-list PR template

```
## Why
Plinth is an open-core Forms / Catch / Schema toolkit for solo builders on Cloudflare Workers.

## Links
- https://plinthrun.com
- https://github.com/YOUR_USER/plinth
- npm: @plinth/schema @plinth/forms @plinth/catch
```

## Release cadence

- Schema library: fix-driven
- API: whenever entitlements or quotas change
- Web: whenever SEO or companion tools change

## Day-60 review

Per product, compute: paying customers, visits/mo, support load. Apply kill/double-down from STRATEGY.md. Update STRATEGY “Current focus”.
