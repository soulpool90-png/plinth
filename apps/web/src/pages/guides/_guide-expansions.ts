/** Extra sections appended before the guide footer to reach long-form depth. */
export const GUIDE_EXPANSIONS: Record<string, string> = {
  "static-site-contact-form": `
<h2>Choosing fields and validation</h2>
<p>HTML5 validation (<code class="inline-code">required</code>, <code class="inline-code">type="email"</code>) runs in the browser before the POST leaves the visitor's machine. That reduces garbage reaching Plinth but is not a security boundary — bots bypass it trivially. Server-side screening on Plinth is what matters for spam. Keep field names stable (<code class="inline-code">name</code>, <code class="inline-code">email</code>, <code class="inline-code">message</code>) so webhook consumers and CSV exports stay predictable.</p>
<p>If you need file uploads, static HTML forms are the wrong tool unless you add a separate upload flow. Plinth Forms focuses on text fields; for attachments, link to cloud storage or use a dedicated upload widget that POSTs metadata only.</p>

<h2>CORS and cross-origin POST</h2>
<p>Browser form submissions use a full navigation POST, not <code class="inline-code">fetch</code>, so CORS does not block them. If you switch to JavaScript <code class="inline-code">fetch</code>, ensure your Plinth form allows your site origin — check <a href="/docs/forms">Forms docs</a> for current behavior. When in doubt, stick with native <code class="inline-code">&lt;form method="POST"&gt;</code> for contact pages.</p>

<h2>Troubleshooting</h2>
<ul>
  <li><strong>Blank page after submit</strong> — Add <code class="inline-code">_redirect</code> hidden field pointing to your thank-you page.</li>
  <li><strong>Submission not in inbox</strong> — Confirm you posted to the correct <code class="inline-code">frm_</code> id; anonymous forms expire after 24h on free tier.</li>
  <li><strong>Everything marked spam</strong> — Ensure honeypot is empty and not autofilled by password managers; see <a href="/guides/honeypot-spam-form">honeypot guide</a>.</li>
  <li><strong>Works locally, fails in prod</strong> — Verify production HTML has the same action URL as your test environment.</li>
</ul>

<h2>Production checklist</h2>
<ol>
  <li>Form action uses HTTPS Plinth URL.</li>
  <li>Honeypot field present and off-screen.</li>
  <li>Thank-you redirect configured.</li>
  <li>Test submission from production domain recorded in inbox.</li>
  <li>Upgrade to <a href="/pricing">Pro</a> before launch if you need webhooks or year-long retention.</li>
</ol>

<h2>FAQ</h2>
<p><strong>Do I need JavaScript?</strong> No. Plain HTML is the intended path for static sites.</p>
<p><strong>Can I use the same form on multiple pages?</strong> Yes — one action URL, many forms.</p>
<p><strong>What about GDPR?</strong> You control what fields you collect; Plinth stores what you POST. See <a href="/legal/privacy">privacy policy</a> for processor details.</p>
`,

  "astro-contact-form": `
<h2>Layouts and shared partials</h2>
<p>Extract the form into <code class="inline-code">src/components/ContactForm.astro</code> and pass the action URL as a prop from your layout. That keeps the contact page, footer CTA, and landing page variants in sync when you rotate form IDs between staging and production.</p>
<pre><code>---
const { action } = Astro.props;
---
&lt;form method="POST" action={action}&gt;...&lt;/form&gt;</code></pre>

<h2>Content collections and MDX</h2>
<p>MDX pages can import the Astro component directly. Avoid embedding form HTML inside Markdown strings — Astro components give you type-checked props and consistent honeypot markup.</p>

<h2>SSR and hybrid modes</h2>
<p>If you enable SSR for other routes, the contact form can still POST externally. You do not need to colocate the handler in Astro unless you are proxying for secrecy. Proxying adds latency and an extra failure point; prefer public form IDs on marketing pages.</p>

<h2>Troubleshooting</h2>
<ul>
  <li><strong>Env var undefined in build</strong> — Prefix with <code class="inline-code">PUBLIC_</code> for client-visible values; rebuild after changing <code class="inline-code">.env</code>.</li>
  <li><strong>Redirect goes to wrong host</strong> — Use absolute URLs in <code class="inline-code">_redirect</code> when deploying to subpaths.</li>
  <li><strong>Island fetch fails</strong> — Fall back to native form POST; see <a href="/docs/forms">Forms docs</a>.</li>
</ul>

<h2>FAQ</h2>
<p><strong>Does this work with Astro on Cloudflare?</strong> Yes — static output or edge SSR both support external form actions.</p>
<p><strong>Can I style with Tailwind?</strong> Yes — classes on the form elements work as usual.</p>
`,

  "hugo-contact-form": `
<h2>i18n and multilingual sites</h2>
<p>Hugo's i18n bundles translate labels while the Plinth action URL stays constant. Put <code class="inline-code">plinthFormUrl</code> in <code class="inline-code">config.toml</code> once; partials reference <code class="inline-code">site.Params</code>. For multi-language thank-you pages, compute <code class="inline-code">_redirect</code> with <code class="inline-code">absURL</code> per language section.</p>

<h2>Goldmark and unsafe HTML</h2>
<p>If you embed the form in Markdown via shortcodes, enable the shortcode path instead of raw HTML blocks — cleaner reviews and less <code class="inline-code">unsafe</code> Goldmark config.</p>

<h2>Deploy targets</h2>
<p>Hugo on Cloudflare Pages, GitHub Pages, or S3 all work identically because the form POST leaves the browser for Plinth. No host-specific form attributes required — contrast with <a href="/guides/netlify-forms-alternative">Netlify Forms</a>.</p>

<h2>Troubleshooting</h2>
<ul>
  <li><strong>Partial not found</strong> — Partials live under <code class="inline-code">layouts/partials/</code>; use <code class="inline-code">{{ partial "contact-form.html" . }}</code>.</li>
  <li><strong>Param empty in production</strong> — Set <code class="inline-code">plinthFormUrl</code> in production config or CI env injection.</li>
</ul>

<h2>FAQ</h2>
<p><strong>Works with Hugo modules?</strong> Yes — ship the partial inside your theme module.</p>
<p><strong>Can I use multiple forms?</strong> Yes — different params or hardcoded action URLs per partial.</p>
`,

  "11ty-contact-form": `
<h2>Data cascade and environments</h2>
<p>Use <code class="inline-code">.env</code> files with <code class="inline-code">dotenv</code> in Eleventy config so local, staging, and production each point at different Plinth form IDs without template edits. Document the env var in your README for collaborators.</p>

<h2>Paired with deployment pipelines</h2>
<p>CI builds should inject <code class="inline-code">PLINTH_FORM_URL</code> as a secret. GitHub Actions example: pass the secret into <code class="inline-code">env:</code> before <code class="inline-code">npx @11ty/eleventy</code>.</p>

<h2>Troubleshooting</h2>
<ul>
  <li><strong>Undefined plinthFormUrl</strong> — Confirm <code class="inline-code">addGlobalData</code> runs before build; log in config during debug.</li>
  <li><strong>Shortcode HTML escaped</strong> — Return unescaped HTML from shortcode or use Nunjucks <code class="inline-code">{% safe %}</code> patterns per your template engine.</li>
</ul>

<h2>FAQ</h2>
<p><strong>Liquid vs Nunjucks?</strong> Same form markup — only template syntax differs.</p>
`,

  "nextjs-contact-form": `
<h2>App Router vs Pages Router</h2>
<p>Both routers support external form actions in JSX. Server Actions are optional. For marketing routes statically generated at build time, external POST keeps <code class="inline-code">output: "export"</code> viable.</p>

<h2>Security headers and CSP</h2>
<p>If you use a strict Content-Security-Policy, form-action must allow <code class="inline-code">https://api.plinthrun.com</code>. Native form POST does not require <code class="inline-code">connect-src</code> for the API.</p>

<h2>Troubleshooting</h2>
<ul>
  <li><strong>ENV not available client-side</strong> — Use <code class="inline-code">NEXT_PUBLIC_</code> prefix for action URL in client components.</li>
  <li><strong>Route Handler double-parse</strong> — Forward raw body if you proxy; do not re-stringify for signature providers.</li>
</ul>

<h2>FAQ</h2>
<p><strong>Vercel serverless needed?</strong> Not for external form POST.</p>
`,

  "test-stripe-webhooks": `
<h2>Event types worth capturing first</h2>
<p>Start with <code class="inline-code">checkout.session.completed</code> and <code class="inline-code">customer.subscription.updated</code> if you bill subscriptions. Payment failures (<code class="inline-code">invoice.payment_failed</code>) are second priority. Capture at least one of each in Catch before writing handler switch cases.</p>

<h2>Stripe CLI vs Catch</h2>
<p>Stripe CLI forwards to localhost in real time — great for tight loops. Catch adds a durable inbox you can share with teammates and replay later. Many teams use both: CLI for initial dev, Catch for reproducing bugs weeks later via <a href="/guides/webhook-replay">replay</a>.</p>

<h2>Troubleshooting</h2>
<ul>
  <li><strong>404 on Catch URL</strong> — Verify bin id; bins expire on free tier (<a href="/guides/catch-bin-expire">expiry guide</a>).</li>
  <li><strong>Stripe shows failed delivery</strong> — Catch must return 2xx; anonymous bins should accept POST by default.</li>
  <li><strong>Empty body</strong> — Stripe sends raw JSON; inspect via API not dashboard alone.</li>
</ul>

<h2>FAQ</h2>
<p><strong>Test vs live mode?</strong> Separate endpoints and secrets — never mix.</p>
`,

  "test-github-webhooks": `
<h2>Organization vs repository webhooks</h2>
<p>Repo webhooks are easiest for single-project workflows. Org webhooks fan in many repos — useful for security scanning integrations. Catch bins are cheap to mint; use one bin per repo during development to avoid cross-talk.</p>

<h2>Ping event</h2>
<p>GitHub sends <code class="inline-code">ping</code> when you create the webhook. Confirm it lands in Catch before merging handler code — proves URL and firewall path.</p>

<h2>Troubleshooting</h2>
<ul>
  <li><strong>Secret mismatch</strong> — Regenerate secret in GitHub settings; update local env.</li>
  <li><strong>SSL errors</strong> — Catch URL must be HTTPS; GitHub rejects http endpoints.</li>
</ul>

<h2>FAQ</h2>
<p><strong>Enterprise GitHub?</strong> Same payload shape; egress must reach api.plinthrun.com.</p>
`,

  "llm-json-repair": `
<h2>Where to call repair in the pipeline</h2>
<p>Repair immediately after the model returns and before any <code class="inline-code">JSON.parse</code> in application code. In agent frameworks, wrap tool-output parsers with repair. In batch ETL, repair in a map step before loading warehouses.</p>

<h2>Observability</h2>
<p>Log the <code class="inline-code">repairs</code> array from the library response. Spikes in <code class="inline-code">python_bool</code> or <code class="inline-code">trailing_comma</code> indicate prompt drift or model version changes.</p>

<h2>Troubleshooting</h2>
<ul>
  <li><strong>Repair returns null</strong> — Text may be truncated mid-object; retry model with higher max tokens.</li>
  <li><strong>Valid JSON but wrong shape</strong> — Use validate step — <a href="/guides/structured-output-json-schema">JSON Schema guide</a>.</li>
</ul>

<h2>FAQ</h2>
<p><strong>Latency?</strong> Repair is milliseconds for typical payloads — far cheaper than a second model call.</p>
`,

  "structured-output-json-schema": `
<h2>Schema design tips</h2>
<p>Prefer <code class="inline-code">additionalProperties: false</code> on objects you fully specify — models love extra keys. Use <code class="inline-code">enum</code> for small closed sets instead of free strings when business rules allow.</p>

<h2>Error feedback loops</h2>
<p>Format validation errors as bullet list in the retry user message. Include path and constraint — models fix faster with <code class="inline-code">/customer_email must match format email</code> than generic "invalid JSON."</p>

<h2>Troubleshooting</h2>
<ul>
  <li><strong>Intermittent validation failures</strong> — Temperature too high; lower for extraction tasks.</li>
  <li><strong>Schema too large</strong> — Split into two-step extract then refine.</li>
</ul>

<h2>FAQ</h2>
<p><strong>JSON Schema draft?</strong> Plinth uses standard JSON Schema compatible with common validators — see <a href="/docs/schema">Schema docs</a>.</p>
`,

  "webhook-replay": `
<h2>Idempotency in your handler</h2>
<p>Replaying the same event exercises idempotency. Use provider event ids (<code class="inline-code">event.id</code> in Stripe, <code class="inline-code">X-GitHub-Delivery</code> in GitHub) to dedupe. Replay is how you prove idempotency works.</p>

<h2>Staging vs production replay</h2>
<p>Replay to staging first. When confident, replay once against production with feature flags guarding new code paths.</p>

<h2>Troubleshooting</h2>
<ul>
  <li><strong>Replay timeout</strong> — Localhost must be reachable from Plinth replay worker; use tunnel if needed on Pro.</li>
  <li><strong>401 on replay</strong> — Pro API key required — <a href="/guides/polar-billing-api-keys">billing guide</a>.</li>
</ul>

<h2>FAQ</h2>
<p><strong>How many replays?</strong> Unlimited within fair use; same event id is idempotent on your side.</p>
`,

  "open-core-form-backend": `
<h2>D1 schema sketch</h2>
<p>Self-hosters typically store submissions in D1 with form id, created_at, fields JSON, and spam verdict. Index by form id and created_at for inbox queries. The npm screener returns structured verdicts you persist for tuning.</p>

<h2>When to stay on hosted Plinth</h2>
<p>If you do not want to operate D1 migrations, spam tuning, and rate limits, hosted <a href="/forms">Forms</a> is cheaper in engineer time. Open core shines when compliance requires data residency in your Cloudflare account.</p>

<h2>Troubleshooting</h2>
<ul>
  <li><strong>Worker size limits</strong> — Tree-shake @plinth/forms imports.</li>
  <li><strong>False positives</strong> — Log verdict reasons and adjust honeypot field name.</li>
</ul>

<h2>FAQ</h2>
<p><strong>License?</strong> Check npm package license for self-host terms.</p>
`,

  "mcp-json-repair": `
<h2>Cursor and Claude Desktop</h2>
<p>Add the MCP server URL in settings JSON. Restart the client after changes. Tools appear in the tool picker for agent mode.</p>

<h2>Combining tools in one session</h2>
<p>An agent can <code class="inline-code">catch_create_bin</code>, configure a webhook, capture traffic, then <code class="inline-code">schema_repair</code> on JSON bodies — full integration test without leaving chat.</p>

<h2>Troubleshooting</h2>
<ul>
  <li><strong>Tool not listed</strong> — Confirm MCP URL reachable; check corporate proxy.</li>
  <li><strong>Rate limited</strong> — Attach API key per <a href="/docs/api-keys">API keys docs</a>.</li>
</ul>

<h2>FAQ</h2>
<p><strong>Self-hosted MCP?</strong> HTTP API equivalent documented in <a href="/docs/schema">Schema docs</a>.</p>
`,

  "formspree-free-tier-limit": `
<h2>Total cost of ownership</h2>
<p>Free tiers optimize for activation, not scale. Model not just per-form pricing but retention, webhook availability, and whether branding on thank-you pages matters for your product. Plinth bundles <a href="/catch">Catch</a> and <a href="/schema">Schema</a> so one <a href="/pricing">Pro</a> subscription covers multiple integration pain points.</p>

<h2>Side-by-side test</h2>
<p>Run both backends in parallel for a week — duplicate form actions on a staging page is overkill; instead POST test payloads with curl to each endpoint and compare inbox UX, API ergonomics, and spam false positives.</p>

<h2>Troubleshooting migration</h2>
<ul>
  <li><strong>Old Formspree notifications still arriving</strong> — Remove old action URLs from every template branch and CDN cache.</li>
  <li><strong>Missing submissions after cutover</strong> — Search repo for hardcoded formspree.io URLs.</li>
</ul>

<h2>FAQ</h2>
<p><strong>Import old submissions?</strong> Export from prior vendor CSV; Plinth does not import historical rows.</p>
`,

  "webhook-site-alternative-free": `
<h2>Team workflows</h2>
<p>Share bin event JSON in tickets instead of screenshotting Webhook.site UI. <code class="inline-code">GET /events</code> is scriptable for CI fixtures.</p>

<h2>Custom domains</h2>
<p>Neither tool requires custom domains for debugging. Production webhooks should eventually leave Catch and hit your own endpoint.</p>

<h2>Troubleshooting</h2>
<ul>
  <li><strong>Bin full or expired</strong> — See <a href="/guides/catch-bin-expire">expiry</a>; export before TTL.</li>
  <li><strong>Large bodies truncated</strong> — Check limits in <a href="/docs/catch">Catch docs</a>.</li>
</ul>

<h2>FAQ</h2>
<p><strong>Need permanent URLs?</strong> Create fresh bins; treat as ephemeral debug resources.</p>
`,

  "python-true-in-json": `
<h2>Detection in logs</h2>
<p>Regex for <code class="inline-code">\\bTrue\\b</code> in model output is a useful metric. Sudden increase after model upgrade warrants prompt regression tests.</p>

<h2>Other Python literals</h2>
<p>Models occasionally emit <code class="inline-code">NaN</code> or <code class="inline-code">Infinity</code> — also non-JSON. Plinth repair handles common cases; extreme values may still need manual review.</p>

<h2>Troubleshooting</h2>
<ul>
  <li><strong>Repair ok but types wrong</strong> — Schema validate booleans explicitly.</li>
  <li><strong>Strings containing "True"</strong> — Repair tokenizer preserves strings; do not hand-roll replace.</li>
</ul>

<h2>FAQ</h2>
<p><strong>YAML confusion?</strong> Some models output YAML — repair targets JSON; convert upstream if needed.</p>
`,

  "trailing-comma-json-fix": `
<h2>Nested structures</h2>
<p>Trailing commas appear in nested arrays and objects alike. Deeply nested LLM outputs may have multiple commas to strip — repair walks the whole tree.</p>

<h2>JSON5 temptation</h2>
<p>JSON5 allows trailing commas but is not universal in databases and APIs. Repair to standard JSON keeps downstream compatibility.</p>

<h2>Troubleshooting</h2>
<ul>
  <li><strong>Still fails parse</strong> — Combine issues — run full repair per <a href="/guides/llm-json-repair">LLM JSON repair</a>.</li>
</ul>

<h2>FAQ</h2>
<p><strong>ESLint JSON?</strong> Linters allow trailing commas in config files; LLM output is not ESLint.</p>
`,

  "netlify-forms-alternative": `
<h2>Build-time detection removal</h2>
<p>Netlify injects a hidden HTML form at build for detection. Remove those artifacts when migrating or your repo still depends on Netlify-specific behavior.</p>

<h2>Cloudflare Pages + 11ty</h2>
<p>Common migration path: same Eleventy repo, different host, Plinth action URL. Zero server code change beyond form action.</p>

<h2>Troubleshooting</h2>
<ul>
  <li><strong>Forms still in Netlify UI</strong> — Old deploy branch may still register; disable in Netlify dashboard.</li>
</ul>

<h2>FAQ</h2>
<p><strong>Netlify Functions for email?</strong> Plinth replaces the need for a function solely to send email.</p>
`,

  "stripe-webhook-signature-test": `
<h2>Raw body in frameworks</h2>
<p>Next.js App Router: disable default body parser. Express: use <code class="inline-code">express.raw</code>. Fastify: <code class="inline-code">addContentTypeParser</code> for raw buffer. Signature verification fails if any middleware parses JSON first.</p>

<h2>Clock skew</h2>
<p>Stripe tolerance window rejects ancient timestamps. Replay old events promptly or mock time in unit tests only.</p>

<h2>Troubleshooting</h2>
<ul>
  <li><strong>Signature ok in CLI, fails in app</strong> — Compare raw bytes hex-dump between Catch export and your server logs.</li>
</ul>

<h2>FAQ</h2>
<p><strong>whsec rotation?</strong> Update env and redeploy; replay old events with old secret if needed.</p>
`,

  "github-webhook-payload-inspect": `
<h2>Filtering events in handler</h2>
<p>GitHub sends many event types to the same URL. Early-return on unwanted <code class="inline-code">X-GitHub-Event</code> values to save compute — but log unknown types during beta integrations.</p>

<h2>Large payloads</h2>
<p><code class="inline-code">push</code> events with many commits can be large. Ensure your worker request size limits exceed peak payload.</p>

<h2>Troubleshooting</h2>
<ul>
  <li><strong>Duplicate processing</strong> — Use delivery id as idempotency key.</li>
</ul>

<h2>FAQ</h2>
<p><strong>GitHub Enterprise Server?</strong> Payload shape matches github.com; URL paths differ.</p>
`,

  "llm-markdown-json-fence": `
<h2>Multiple fences</h2>
<p>Models sometimes wrap JSON in fences and add prose after. Repair extracts the first JSON value or object — trim explanatory text.</p>

<h2>json language tag</h2>
<p>Fence may say <code class="inline-code">json</code> or be unlabeled backticks — both appear in production logs.</p>

<h2>Troubleshooting</h2>
<ul>
  <li><strong>Nested code in strings</strong> — Rare; if repair fails, ask model to escape inner backticks.</li>
</ul>

<h2>FAQ</h2>
<p><strong>XML output?</strong> Different parser — Schema repair is JSON-focused.</p>
`,

  "json-schema-validate-openai": `
<h2>strict mode evolution</h2>
<p>OpenAI response format features evolve. Regardless of provider flags, keep Plinth validate as final gate before side effects.</p>

<h2>Cost optimization</h2>
<p>One repair+validate call beats two model calls when the only issue is syntax. Reserve retries for semantic validation errors.</p>

<h2>Troubleshooting</h2>
<ul>
  <li><strong>format email rejects valid addresses</strong> — Schema format checks are strict; loosen to pattern if needed.</li>
</ul>

<h2>FAQ</h2>
<p><strong>Other providers?</strong> Same pipeline for Anthropic, Gemini, local models — repair is model-agnostic.</p>
`,

  "catch-bin-expire": `
<h2>Planning integration tests</h2>
<p>Schedule bin creation at start of sprint; export fixtures before expiry. Store JSON in repo <code class="inline-code">fixtures/</code> for unit tests without network.</p>

<h2>Compliance</h2>
<p>Do not leave customer PII in bins longer than needed. Expiry is a feature for GDPR minimization.</p>

<h2>Troubleshooting</h2>
<ul>
  <li><strong>Events disappeared</strong> — Free TTL elapsed; upgrade or export earlier.</li>
</ul>

<h2>FAQ</h2>
<p><strong>Extend one bin?</strong> Pro retention — <a href="/pricing">Pricing</a>.</p>
`,

  "honeypot-spam-form": `
<h2>Accessibility</h2>
<p><code class="inline-code">aria-hidden="true"</code> and <code class="inline-code">tabindex="-1"</code> keep screen readers and keyboard users off the honeypot. Never use a visible field labeled "leave blank" — humans fail that test.</p>

<h2>Advanced bots</h2>
<p>Targeted bots may skip hidden fields. Layer rate limits and Pro heuristics for high-risk forms.</p>

<h2>Troubleshooting</h2>
<ul>
  <li><strong>Password manager fills honeypot</strong> — Rename field from email-like names; use <code class="inline-code">_gotcha</code>.</li>
</ul>

<h2>FAQ</h2>
<p><strong>reCAPTCHA?</strong> Not required for most indie sites with honeypot + Plinth screening.</p>
`,

  "polar-billing-api-keys": `
<h2>Rotating keys</h2>
<p>Issue a new key in dashboard, deploy, revoke old key. Forms in production should not embed keys — keys are server-side for listing submissions.</p>

<h2>Mapping products to entitlements</h2>
<p>Polar product ids map to Plinth features via webhook handlers. If checkout succeeded but key lacks Pro, check Polar webhook delivery logs.</p>

<h2>Troubleshooting</h2>
<ul>
  <li><strong>403 on API</strong> — Key typo or expired subscription.</li>
  <li><strong>Anonymous still works</strong> — Expected for public POST endpoints; keys gate owner operations.</li>
</ul>

<h2>FAQ</h2>
<p><strong>Multiple products?</strong> One key per account covers entitled products — see <a href="/pricing">Pricing</a>.</p>
`,
};
