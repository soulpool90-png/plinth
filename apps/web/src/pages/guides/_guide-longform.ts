/** Per-slug longform sections (worked examples, integration notes). */
export const GUIDE_LONGFORM: Record<string, string> = {
  "static-site-contact-form": `
<h2>Worked example: portfolio contact page</h2>
<p>Imagine a designer portfolio on Cloudflare Pages with a single <code class="inline-code">contact.html</code> page. You mint a Plinth form at <a href="/forms">/forms</a>, copy the action URL, and paste the HTML snippet into the page. You add a <code class="inline-code">thanks.html</code> page and set <code class="inline-code">_redirect</code> to its absolute URL. After deploy, you submit from your phone on cellular — not Wi‑Fi localhost — to confirm the live path. Within seconds, <code class="inline-code">GET /v1/forms/frm_…</code> shows the row. That end-to-end test is your launch checklist.</p>
<p>If you later add a blog on the same domain, reuse the same form id or create a second form for “newsletter” vs “hire me” so submissions stay separated in the inbox. Plinth stores whatever fields you POST — there is no schema enforced on forms, which keeps migration from other vendors simple.</p>
<h2>Security notes</h2>
<p>Form endpoints are public by design. Do not POST secrets, API keys, or health data without reviewing compliance needs. Honeypot and rate limits reduce bot noise but are not access control. For owner-only submission listing, use an API key on the server — never embed keys in static HTML. See <a href="/docs/api-keys">API keys</a> and <a href="/guides/polar-billing-api-keys">Polar billing</a> for authenticated access patterns.</p>
`,
  "astro-contact-form": `
<h2>Worked example: multi-page Astro site</h2>
<p>A documentation site with <code class="inline-code">src/pages/contact.astro</code> and a “Report issue” footer on every page imports <code class="inline-code">ContactForm.astro</code> with a shared <code class="inline-code">PUBLIC_PLINTH_FORM_URL</code>. The footer variant passes a hidden <code class="inline-code">source=footer</code> field so inbox filtering distinguishes full contact messages from quick reports. Astro’s static build emits identical HTML to what Hugo would — the Plinth side sees the same POST shape.</p>
<p>When you add View Transitions or client routers, native form POST still performs full navigation unless you intercept with JavaScript. For contact flows, full navigation to a thank-you page is often preferable UX anyway.</p>
<h2>Integration with Plinth stack</h2>
<p>Same project might use <a href="/catch">Catch</a> for GitHub webhooks on docs deploy and <a href="/schema">Schema</a> for search indexing pipelines. One <a href="/pricing">Pro</a> account covers all three — see <a href="/docs">docs hub</a>.</p>
`,
  "hugo-contact-form": `
<h2>Worked example: theme partial</h2>
<p>Ship <code class="inline-code">layouts/partials/plinth-contact.html</code> inside a Hugo theme module. Consumers set <code class="inline-code">plinthFormUrl</code> in their site config. The theme maintainer documents the parameter in README. When Plinth rotates API hostnames, consumers update one config key — not every Markdown file.</p>
<p>For contact pages built from <code class="inline-code">content/contact.md</code>, front matter can override redirect targets per language: <code class="inline-code">plinthRedirect: /fr/merci/</code> read by the partial.</p>
<h2>Compare hosting paths</h2>
<p>Hugo on Netlify historically used Netlify Forms; moving to Cloudflare Pages is a config and form-action change, not a rewrite of content — <a href="/guides/netlify-forms-alternative">Netlify alternative guide</a>.</p>
`,
  "11ty-contact-form": `
<h2>Worked example: design system site</h2>
<p>An Eleventy design system docs site adds a “Contact maintainers” page. The form includes <code class="inline-code">component</code> select populated from a JSON data file generated at build time. Plinth stores the extra field verbatim — useful when triaging which component library area the message concerns.</p>
<p>Pair with <code class="inline-code">@11ty/eleventy-plugin-syntaxhighlight</code> and other plugins freely; none conflict with external form POST.</p>
<h2>Formspree refugees</h2>
<p>Teams hitting <a href="/guides/formspree-free-tier-limit">Formspree limits</a> often run 11ty on Netlify — swap action URL, keep Eleventy pipeline.</p>
`,
  "nextjs-contact-form": `
<h2>Worked example: SaaS marketing + app</h2>
<p>Marketing routes (<code class="inline-code">app/(marketing)/contact/page.tsx</code>) use external Plinth POST. Authenticated app routes use Server Actions for product logic. Separation keeps marketing deployable as static segments where possible and avoids mixing lead capture with session cookies on the same handler.</p>
<p>If marketing and app share a layout, ensure the contact form does not inherit CSRF middleware meant for same-origin API routes — external POST bypasses your Next middleware entirely.</p>
<h2>Observability</h2>
<p>Pro webhooks can fan inbound leads to Slack while your Next app ignores form traffic — <a href="/docs/forms">Forms docs</a>.</p>
`,
  "test-stripe-webhooks": `
<h2>Worked example: checkout integration</h2>
<p>You implement <code class="inline-code">checkout.session.completed</code> to provision a user account. Stripe test checkout completes; Catch records the event. You read JSON, write handler, run locally with replay (<a href="/guides/webhook-replay">guide</a>). Handler throws on missing metadata — fix, replay same <code class="inline-code">evt_</code>, get 200. Ship to production with confidence.</p>
<p>Keep a spreadsheet of which Catch bin maps to which Stripe test endpoint — easy to accumulate stale bins; <a href="/guides/catch-bin-expire">expiry</a> applies.</p>
<h2>Signature testing</h2>
<p>Before replay, validate signatures per <a href="/guides/stripe-webhook-signature-test">signature guide</a>.</p>
`,
  "test-github-webhooks": `
<h2>Worked example: PR automation</h2>
<p>A bot comments on opened PRs when labels are missing. Point repo webhook at Catch, open a test PR, inspect <code class="inline-code">pull_request</code> payload in <a href="/guides/github-webhook-payload-inspect">payload guide</a>, code against real JSON, replay until label logic passes.</p>
<p>Use separate bins for fork PRs if you worry about untrusted payload content in shared debug bins.</p>
<h2>Webhook.site comparison</h2>
<p><a href="/guides/webhook-site-alternative-free">Alternative guide</a> explains when to switch inspectors.</p>
`,
  "llm-json-repair": `
<h2>Worked example: extraction pipeline</h2>
<p>Nightly job asks a model to extract invoice fields from email text. Output arrives fenced with Python booleans. Pipeline: repair → validate against invoice schema → load to database. Invalid rows go to dead-letter queue with validation errors for human review — not silent drops.</p>
<p>Track repair kinds over time; a new model version might fix fences but introduce <code class="inline-code">undefined</code> literals — extend tests when upgrading models.</p>
<h2>Related repairs</h2>
<p><a href="/guides/python-true-in-json">Python booleans</a>, <a href="/guides/trailing-comma-json-fix">trailing commas</a>, <a href="/guides/llm-markdown-json-fence">fences</a>.</p>
`,
  "structured-output-json-schema": `
<h2>Worked example: lead scoring</h2>
<p>Schema requires <code class="inline-code">score</code> integer 0–100 and <code class="inline-code">reason</code> string. Model returns <code class="inline-code">score: "high"</code> — validation fails with type error. Retry prompt includes error; second pass returns integer. You persist only validated rows.</p>
<p>Document schemas in repo as <code class="inline-code">*.schema.json</code> and test against fixture bad outputs in CI using <code class="inline-code">@plinth/schema</code>.</p>
<h2>OpenAI path</h2>
<p><a href="/guides/json-schema-validate-openai">OpenAI validation guide</a> for provider-specific tips.</p>
`,
  "webhook-replay": `
<h2>Worked example: regression after refactor</h2>
<p>Refactor renamed env var; production webhooks succeeded but staging replays failed. Catch replay against staging caught the bug pre-deploy. After fix, one replay per stored failure case — faster than re-firing Stripe charges.</p>
<p>Automate replay in CI with stored fixtures exported before bin expiry — <a href="/guides/catch-bin-expire">expiry guide</a>.</p>
<h2>Pro requirement</h2>
<p>Replay is Pro — <a href="/guides/polar-billing-api-keys">API keys</a> after <a href="/pricing">checkout</a>.</p>
`,
  "open-core-form-backend": `
<h2>Worked example: agency white-label</h2>
<p>Agency runs Workers per client with branded subdomain and D1 per client. @plinth/forms screens spam consistently; agency builds simple admin UI on top of D1. Clients never see Plinth branding — acceptable trade for ops burden.</p>
<p>When a client outgrows custom ops, migrate action URL to hosted <a href="/forms">Plinth</a> without changing their HTML field names.</p>
<h2>Honeypot in self-host</h2>
<p><a href="/guides/honeypot-spam-form">Honeypot guide</a> applies identically.</p>
`,
  "mcp-json-repair": `
<h2>Worked example: agent builds integration</h2>
<p>User asks Cursor agent to “wire Stripe test webhook.” Agent calls <code class="inline-code">catch_create_bin</code>, returns URL for Dashboard, user triggers event, agent fetches events via API tool or user paste, agent writes handler using real payload. JSON config from model passes through <code class="inline-code">schema_repair</code> before writing file.</p>
<p>Reduces malformed config commits in agent-driven workflows.</p>
<h2>HTTP fallback</h2>
<p>Non-MCP CI uses <a href="/docs/schema">Schema HTTP API</a> identically.</p>
`,
  "formspree-free-tier-limit": `
<h2>Worked example: launch week traffic</h2>
<p>Product Hunt launch sends 800 messages in 48 hours. Formspree free cap blocks submission 501 with vendor-specific error page — bad look. Plinth free tier quotas differ; plan <a href="/pricing">Pro</a> before launch if you expect spikes. Export test metrics from prior launches to estimate volume.</p>
<p>Combine with <a href="/guides/honeypot-spam-form">honeypot</a> so spike is not 90% bots.</p>
<h2>Static site fit</h2>
<p><a href="/guides/static-site-contact-form">Static site guide</a> — same HTML, new action.</p>
`,
  "webhook-site-alternative-free": `
<h2>Worked example: vendor onboarding</h2>
<p>SaaS partner sends sample webhooks during integration. You create Catch bin, share URL in ticket, they fire samples, you attach exported JSON to Jira. Reviewers see exact bytes — better than paraphrasing.</p>
<p>After go-live, delete bin or let it expire — <a href="/guides/catch-bin-expire">expiry</a>.</p>
<h2>Stripe/GitHub</h2>
<p><a href="/guides/test-stripe-webhooks">Stripe</a> and <a href="/guides/test-github-webhooks">GitHub</a> guides use Catch end-to-end.</p>
`,
  "python-true-in-json": `
<h2>Worked example: config generator</h2>
<p>Model generates CI config JSON; output uses <code class="inline-code">True</code> for <code class="inline-code">publish</code> flag. Repair converts to <code class="inline-code">true</code>; validator ensures boolean before writing <code class="inline-code">.github/workflows/deploy.json</code> (if you inline JSON) or before <code class="inline-code">JSON.parse</code> in generator script.</p>
<p>Add unit test with Python literals fixture — prevents regressions when switching models.</p>
<h2>Broader repair</h2>
<p><a href="/guides/llm-json-repair">LLM JSON repair overview</a>.</p>
`,
  "trailing-comma-json-fix": `
<h2>Worked example: array-heavy extraction</h2>
<p>Model returns <code class="inline-code">"tags": ["a", "b", "c",]</code> — classic trailing comma. Repair strips comma; schema validates tag count and uniqueness. Without repair, entire batch job fails on first bad row.</p>
<p>Log raw model text on failure for prompt tuning — sometimes ask for “minified JSON, no trailing commas.”</p>
<h2>Combined with fences</h2>
<p><a href="/guides/llm-markdown-json-fence">Markdown fence guide</a>.</p>
`,
  "netlify-forms-alternative": `
<h2>Worked example: Pages migration</h2>
<p>Repo moves from Netlify to Cloudflare Pages. Remove <code class="inline-code">data-netlify</code> attributes and hidden detection forms. Set Plinth action. Update DNS. Submissions flow again without Netlify dashboard — inbox is Plinth API or Pro webhooks.</p>
<p>Update team runbooks that referenced Netlify form notifications.</p>
<h2>11ty/Hugo</h2>
<p><a href="/guides/11ty-contact-form">11ty</a>, <a href="/guides/hugo-contact-form">Hugo</a> guides.</p>
`,
  "stripe-webhook-signature-test": `
<h2>Worked example: Fastify handler</h2>
<p>Register content type parser for <code class="inline-code">application/json</code> as raw buffer on webhook route only. Other routes use default JSON parser. Capture event from Catch; run constructEvent in test; replay via <a href="/guides/webhook-replay">replay</a> until green.</p>
<p>Document middleware order in README — common source of signature bugs for new contributors.</p>
<h2>Capture path</h2>
<p><a href="/guides/test-stripe-webhooks">Stripe Catch setup</a>.</p>
`,
  "github-webhook-payload-inspect": `
<h2>Worked example: release automation</h2>
<p>On <code class="inline-code">release</code> event with <code class="inline-code">action: published</code>, trigger deploy. Catch captures first real release; inspect <code class="inline-code">release.tag_name</code> path; implement; replay from <a href="/guides/webhook-replay">replay</a>. Wrong branch filters caught before production deploy.</p>
<p>Store anonymized fixtures in repo for unit tests.</p>
<h2>Setup</h2>
<p><a href="/guides/test-github-webhooks">GitHub webhook test guide</a>.</p>
`,
  "llm-markdown-json-fence": `
<h2>Worked example: chat completion parsing</h2>
<p>User message asks for JSON; assistant replies with fenced block plus “Hope this helps!” prose. Repair extracts JSON object; validator ensures required keys; UI renders. Without repair, frontend try/catch shows generic error — bad UX.</p>
<p>Strip fences before logging to analytics to avoid double-encoding issues.</p>
<h2>Pipeline order</h2>
<p>Repair first, then <a href="/guides/structured-output-json-schema">validate</a> — never reverse.</p>
<h2>Related</h2>
<p><a href="/guides/llm-json-repair">LLM JSON repair</a>, <a href="/guides/trailing-comma-json-fix">trailing commas</a>, <a href="/guides/python-true-in-json">Python booleans</a>. MCP: <a href="/guides/mcp-json-repair">MCP JSON repair</a>.</p>
`,
  "json-schema-validate-openai": `
<h2>Worked example: tool argument validation</h2>
<p>Function calling returns arguments JSON. OpenAI strict mode helps; you still validate against tool schema before executing side effects (send email, charge card). Repair handles leftover fences from chat-tuned models used off-label for tools.</p>
<p>Return validation errors to model in tool result channel for autonomous correction.</p>
<h2>Schema product</h2>
<p><a href="/schema">Schema</a> landing · <a href="/docs/schema">docs</a>.</p>
`,
  "catch-bin-expire": `
<h2>Worked example: sprint debugging</h2>
<p>Monday: create bin, wire Stripe test. Wednesday: fix bug using replay. Friday: export events to git fixture before weekend expiry. Monday: new bin for next feature — treat bins as disposable scratch paper on the plotting sheet.</p>
<p>Document bin id in PR description so reviewers can inspect same deliveries.</p>
<h2>Pro retention</h2>
<p><a href="/pricing">Pricing</a> when disposable bins are too disruptive.</p>
`,
  "honeypot-spam-form": `
<h2>Worked example: landing page A/B test</h2>
<p>Two landing variants share one Plinth form id with hidden <code class="inline-code">variant=a|b</code> field. Honeypot stays identical on both. Spam rate comparable across variants — if one variant spikes, suspect embed scraper not honeypot failure.</p>
<p>Track spam ratio in Plinth inbox vs legitimate rows after launches.</p>
<h2>Open-core screening</h2>
<p><a href="/guides/open-core-form-backend">@plinth/forms</a> implements same checks self-hosted.</p>
`,
  "polar-billing-api-keys": `
<h2>Worked example: upgrade mid-project</h2>
<p>Builder starts anonymous on <a href="/forms">Forms</a>, hits 24h retention limit during UAT. Checks out Forms Pro via <a href="/pricing">Pricing</a>, claims key at /start, lists submissions with <code class="inline-code">x-plinth-key</code>, enables webhook to Airtable. Same key later enables Catch replay on <a href="/catch">Catch</a> when integrating Stripe.</p>
<p>Store key in deployment secrets manager — never commit to git.</p>
<h2>Docs cross-links</h2>
<p><a href="/docs">Docs</a>, <a href="/docs/api-keys">API keys</a>, <a href="/guides/catch-bin-expire">Catch expiry</a>.</p>
`,
};
