# npm publish (human, ~5 min)

Packages are build-ready: `@plinth/schema`, `@plinth/forms`, `@plinth/catch`.

1. Create an npm account if needed: https://www.npmjs.com/signup
2. Create org `plinth` (public): https://www.npmjs.com/org/create
3. On this machine:

```bash
npm login
cd packages/schema && npm publish --access public
cd ../forms && npm publish --access public
cd ../catch && npm publish --access public
```

Or from repo root after `npm login`:

```bash
npm run build -w @plinth/schema -w @plinth/forms -w @plinth/catch
npm publish -w @plinth/schema --access public
npm publish -w @plinth/forms --access public
npm publish -w @plinth/catch --access public
```

Tell the agent when done so CI badges and READMEs can confirm versions.
