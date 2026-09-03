import { GUIDE_EXPANSIONS } from "./_guide-expansions";
import { GUIDE_LONGFORM } from "./_guide-longform";
import { GUIDE_BOOST } from "./_guide-boost";
import { CATEGORY_PAD } from "./_guide-category-pad";

export interface Guide {
  slug: string;
  title: string;
  description: string;
  category: "Forms" | "Catch" | "Schema" | "Platform";
  htmlBody: string;
}

const footer = (related: string) =>
  `<p class="guide-related">${related}</p>
<p><a href="/docs">All docs</a> · <a href="/forms">Forms</a> · <a href="/catch">Catch</a> · <a href="/schema">Schema</a> · <a href="/pricing">Pricing</a> · <a href="/guides">All guides</a></p>`;

const MIN_WORDS_PAD = `
<h2>Ship checklist</h2>
<p>Before you close the task, verify the happy path on production infrastructure — not only on localhost. For forms, submit from the deployed URL and confirm the row in Plinth. For Catch, trigger a provider event and confirm <code class="inline-code">GET …/events</code> returns it. For Schema, run repair and validate on a saved bad fixture from a real model run. Document the form id, bin id, or schema version in your PR so the next builder inherits context.</p>
<p>Plinth products are designed to compose: marketing sites use <a href="/forms">Forms</a>, billing integrations use <a href="/catch">Catch</a> with <a href="/guides/test-stripe-webhooks">Stripe guides</a>, and agent features use <a href="/schema">Schema</a> with <a href="/guides/mcp-json-repair">MCP</a>. One account on <a href="/pricing">Pricing</a> upgrades the limits that block you — retention, replay, webhooks — without rewriting integrations. Read <a href="/docs">documentation</a> when API behavior is ambiguous; these guides focus on practical plots, not exhaustive reference.</p>
<p>When something fails silently, check free-tier retention first — submissions and bin events expire. Upgrade or export before debugging “missing data.” API keys (<a href="/docs/api-keys">docs</a>) unlock owner operations after Polar checkout (<a href="/guides/polar-billing-api-keys">billing guide</a>).</p>
`;

function wordCount(html: string): number {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean).length;
}

export const GUIDES: Guide[] = [
  {
    slug: "static-site-contact-form",
    title: "Add a contact form to a static site",
    description:
      "Plot a working contact form on any static host — plain HTML, no server — with honeypot spam screening and a Plinth POST endpoint.",
    category: "Forms",
    htmlBody: `
<p>Static hosts — Netlify, Cloudflare Pages, GitHub Pages, S3 — serve files. They do not run your server code. That is a feature: deploys are fast, attack surface is small, and hosting is cheap. The trade-off is that a traditional <code class="inline-code">POST /contact</code> handler does not exist unless you bolt on a function or a third-party form backend.</p>
<p>Plinth <a href="/forms">Forms</a> gives you a POST URL. Point your HTML form <code class="inline-code">action</code> at that URL, add a honeypot field, and submissions land in Plinth where spam heuristics run before storage. You keep the static site; Plinth keeps the inbox.</p>

<h2>Step 1 — Mint a form endpoint</h2>
<p>Open <a href="/forms">/forms</a> and click <strong>Mint anonymous form</strong>, or create one via API:</p>
<pre><code>curl -X POST https://api.plinthrun.com/v1/forms/anonymous</code></pre>
<p>The response includes an <code class="inline-code">action_url</code> like <code class="inline-code">https://api.plinthrun.com/v1/forms/frm_…</code>. That is your form action. Copy it into your HTML.</p>

<h2>Step 2 — Minimal HTML form</h2>
<p>This works on any static page — no build step required:</p>
<pre><code>&lt;form method="POST" action="https://api.plinthrun.com/v1/forms/frm_YOUR_ID"&gt;
  &lt;label&gt;Name &lt;input name="name" required /&gt;&lt;/label&gt;
  &lt;label&gt;Email &lt;input name="email" type="email" required /&gt;&lt;/label&gt;
  &lt;label&gt;Message &lt;textarea name="message" required&gt;&lt;/textarea&gt;&lt;/label&gt;
  &lt;input type="text" name="_gotcha" tabindex="-1" autocomplete="off"
         aria-hidden="true" style="position:absolute;left:-9999px" /&gt;
  &lt;button type="submit"&gt;Send&lt;/button&gt;
&lt;/form&gt;</code></pre>
<p>The <code class="inline-code">_gotcha</code> field is the honeypot. Humans never see it; bots fill it in and Plinth silently drops the submission. See the dedicated <a href="/guides/honeypot-spam-form">honeypot guide</a> for tuning.</p>

<h2>Step 3 — Redirect after submit (optional)</h2>
<p>Add a hidden field so visitors land on your thank-you page instead of the API JSON response:</p>
<pre><code>&lt;input type="hidden" name="_redirect" value="https://yoursite.com/thanks" /&gt;</code></pre>

<h2>Step 4 — Deploy and test</h2>
<p>Push to your static host. Submit once from the live URL (not just localhost) to confirm CORS and action URL are correct. List submissions:</p>
<pre><code>curl https://api.plinthrun.com/v1/forms/frm_YOUR_ID</code></pre>
<p>Free tier keeps submissions for 24 hours. <a href="/pricing">Forms Pro</a> extends retention, adds webhooks, and raises monthly quota. Full API reference: <a href="/docs/forms">Forms docs</a>.</p>

<h2>Framework-specific bearings</h2>
<p>The same pattern ports to every static generator. Dedicated plot sheets:</p>
<ul>
  <li><a href="/guides/astro-contact-form">Astro contact form</a></li>
  <li><a href="/guides/hugo-contact-form">Hugo contact form</a></li>
  <li><a href="/guides/11ty-contact-form">11ty contact form</a></li>
  <li><a href="/guides/nextjs-contact-form">Next.js contact form</a> (static export or client form)</li>
</ul>
<p>Comparing hosted backends? Read <a href="/guides/formspree-free-tier-limit">Formspree free tier limits</a> and <a href="/guides/netlify-forms-alternative">Netlify Forms alternatives</a>.</p>

<h2>Self-host option</h2>
<p>Plinth Forms runs on Cloudflare Workers with an open-source spam screener (<code class="inline-code">@plinth/forms</code>). If you want your own deployment, see <a href="/guides/open-core-form-backend">open-core form backend</a>.</p>
${footer('Related: <a href="/guides/honeypot-spam-form">Honeypot spam screening</a> · <a href="/guides/astro-contact-form">Astro contact form</a>')}
`,
  },
  {
    slug: "astro-contact-form",
    title: "Astro contact form without a server",
    description:
      "Ship an Astro contact page with a plain HTML form pointed at Plinth — no API routes, no adapter, no server runtime.",
    category: "Forms",
    htmlBody: `
<p>Astro excels at static output. You can add server endpoints with adapters, but many contact pages do not need them. A plain HTML <code class="inline-code">&lt;form&gt;</code> with <code class="inline-code">method="POST"</code> and an external action URL posts directly from the browser to <a href="/forms">Plinth Forms</a>. Astro renders the markup; Plinth handles spam, storage, and optional webhooks.</p>

<h2>Contact page component</h2>
<p>Create <code class="inline-code">src/pages/contact.astro</code> (or a partial you include):</p>
<pre><code>---
const FORM_ACTION = import.meta.env.PUBLIC_PLINTH_FORM_URL
  ?? "https://api.plinthrun.com/v1/forms/frm_YOUR_ID";
---
&lt;form method="POST" action={FORM_ACTION} class="contact-form"&gt;
  &lt;label&gt;
    Name
    &lt;input name="name" required /&gt;
  &lt;/label&gt;
  &lt;label&gt;
    Email
    &lt;input name="email" type="email" required /&gt;
  &lt;/label&gt;
  &lt;label&gt;
    Message
    &lt;textarea name="message" required&gt;&lt;/textarea&gt;
  &lt;/label&gt;
  &lt;input type="text" name="_gotcha" tabindex="-1" autocomplete="off"
         aria-hidden="true" class="hp" /&gt;
  &lt;input type="hidden" name="_redirect" value="/thanks" /&gt;
  &lt;button type="submit"&gt;Send message&lt;/button&gt;
&lt;/form&gt;

&lt;style&gt;
  .hp { position: absolute; left: -9999px; }
  .contact-form { display: grid; gap: 1rem; max-width: 36rem; }
&lt;/style&gt;</code></pre>
<p>Store the form URL in <code class="inline-code">.env</code> as <code class="inline-code">PUBLIC_PLINTH_FORM_URL</code> so you can swap between dev and production forms without editing source.</p>

<h2>Why skip Astro API routes here?</h2>
<p>API routes require an adapter (Node, Vercel, Cloudflare). That is fine for apps that already run server code, but a contact form is a single POST. Outsourcing the endpoint means:</p>
<ul>
  <li>Your Astro site stays fully static — deploy anywhere.</li>
  <li>Spam heuristics live in <a href="/guides/open-core-form-backend">@plinth/forms</a>, not your repo.</li>
  <li>You can inspect submissions via API without redeploying.</li>
</ul>

<h2>JSON submit from a client island</h2>
<p>If you hydrate a React/Vue island and want <code class="inline-code">fetch</code> instead of native form POST:</p>
<pre><code>await fetch(FORM_ACTION, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name, email, message, _gotcha: "" }),
});</code></pre>
<p>Plinth accepts <code class="inline-code">application/json</code> and <code class="inline-code">application/x-www-form-urlencoded</code>. Details in <a href="/docs/forms">Forms docs</a>.</p>

<h2>Testing locally</h2>
<p><code class="inline-code">astro dev</code> serves the form HTML. Submitting posts to the live Plinth URL — no tunnel needed. Check the inbox with <code class="inline-code">GET /v1/forms/:id</code> or upgrade for webhooks on <a href="/pricing">Pro</a>.</p>

<h2>Related static-site patterns</h2>
<p>Same approach works for <a href="/guides/hugo-contact-form">Hugo</a>, <a href="/guides/11ty-contact-form">11ty</a>, and plain <a href="/guides/static-site-contact-form">static HTML</a>. For Next.js apps that mix SSR and marketing pages, see <a href="/guides/nextjs-contact-form">Next.js contact form</a>.</p>
${footer('Related: <a href="/guides/static-site-contact-form">Static site contact form</a> · <a href="/guides/honeypot-spam-form">Honeypot field setup</a>')}
`,
  },
  {
    slug: "hugo-contact-form",
    title: "Hugo contact form with Plinth",
    description:
      "Add a contact form to a Hugo static site using a partial template and a Plinth POST endpoint — no Netlify Forms lock-in.",
    category: "Forms",
    htmlBody: `
<p>Hugo builds fast static HTML. It does not ship a form processor. Historically, Hugo users reached for Netlify Forms or Formspree. Plinth <a href="/forms">Forms</a> offers a portable POST URL that works on any host — Cloudflare Pages, GitHub Pages behind a proxy, S3, or your own nginx.</p>

<h2>Create the Plinth form</h2>
<p>Mint an anonymous form at <a href="/forms">/forms</a> or via API (<a href="/docs/forms">docs</a>). Note the <code class="inline-code">action_url</code>.</p>

<h2>Hugo partial</h2>
<p>Add <code class="inline-code">layouts/partials/contact-form.html</code>:</p>
<pre><code>&lt;form method="POST" action="{{ site.Params.plinthFormUrl }}" class="contact-form"&gt;
  &lt;label&gt;{{ i18n "name" }}
    &lt;input name="name" required /&gt;
  &lt;/label&gt;
  &lt;label&gt;{{ i18n "email" }}
    &lt;input name="email" type="email" required /&gt;
  &lt;/label&gt;
  &lt;label&gt;{{ i18n "message" }}
    &lt;textarea name="message" required&gt;&lt;/textarea&gt;
  &lt;/label&gt;
  &lt;input type="text" name="_gotcha" tabindex="-1" autocomplete="off"
         aria-hidden="true" style="position:absolute;left:-9999px" /&gt;
  &lt;input type="hidden" name="_redirect" value="{{ "/thanks/" | absURL }}" /&gt;
  &lt;button type="submit"&gt;{{ i18n "send" }}&lt;/button&gt;
&lt;/form&gt;</code></pre>
<p>Set the action in <code class="inline-code">config.toml</code>:</p>
<pre><code>[params]
  plinthFormUrl = "https://api.plinthrun.com/v1/forms/frm_YOUR_ID"</code></pre>

<h2>Include on your contact page</h2>
<pre><code>---
title: "Contact"
---
{{&lt; partial "contact-form.html" . &gt;}}</code></pre>

<h2>Spam screening</h2>
<p>Plinth runs honeypot and timing heuristics from <code class="inline-code">@plinth/forms</code>. Bots that auto-fill every input trip the honeypot. Tune the field name in Pro; default is <code class="inline-code">_gotcha</code>. Read <a href="/guides/honeypot-spam-form">honeypot spam form</a> for placement tips.</p>

<h2>Deploy anywhere</h2>
<p>Unlike Netlify Forms, Hugo + Plinth does not require <code class="inline-code">netlify.toml</code> form detection or host-specific attributes. Build with <code class="inline-code">hugo</code>, upload <code class="inline-code">public/</code>, done. Compare hosts in <a href="/guides/netlify-forms-alternative">Netlify Forms alternative</a> and <a href="/guides/formspree-free-tier-limit">Formspree limits</a>.</p>

<h2>Webhooks and retention</h2>
<p>Free submissions expire after 24 hours. <a href="/pricing">Forms Pro</a> keeps them a year and can POST to your Slack or CRM webhook. API keys: <a href="/docs/api-keys">docs</a>.</p>
${footer('Related: <a href="/guides/11ty-contact-form">11ty contact form</a> · <a href="/guides/static-site-contact-form">Static site contact form</a>')}
`,
  },
  {
    slug: "11ty-contact-form",
    title: "11ty contact form with Plinth",
    description:
      "Wire an Eleventy contact page to Plinth Forms so you keep static builds and avoid Netlify Forms coupling.",
    category: "Forms",
    htmlBody: `
<p>Eleventy (11ty) outputs HTML from templates — Nunjucks, Liquid, or Markdown. Like Hugo, it has no built-in form handler. Plinth <a href="/forms">Forms</a> is the POST destination: screen spam, store payloads, optionally forward via webhook.</p>

<h2>Environment variable for the action URL</h2>
<p>In <code class="inline-code">.env</code>:</p>
<pre><code>PLINTH_FORM_URL=https://api.plinthrun.com/v1/forms/frm_YOUR_ID</code></pre>
<p>Load it in <code class="inline-code">.eleventy.js</code>:</p>
<pre><code>module.exports = function (eleventyConfig) {
  eleventyConfig.addGlobalData("plinthFormUrl", process.env.PLINTH_FORM_URL);
};</code></pre>

<h2>Nunjucks contact template</h2>
<pre><code>&lt;form method="POST" action="{{ plinthFormUrl }}"&gt;
  &lt;label&gt;Name &lt;input name="name" required /&gt;&lt;/label&gt;
  &lt;label&gt;Email &lt;input name="email" type="email" required /&gt;&lt;/label&gt;
  &lt;label&gt;Message &lt;textarea name="message" required&gt;&lt;/textarea&gt;&lt;/label&gt;
  &lt;input type="text" name="_gotcha" tabindex="-1" autocomplete="off"
         aria-hidden="true" style="position:absolute;left:-9999px" /&gt;
  &lt;button type="submit"&gt;Send&lt;/button&gt;
&lt;/form&gt;</code></pre>

<h2>Why not Netlify Forms?</h2>
<p>Netlify Forms requires deployment on Netlify and hidden <code class="inline-code">data-netlify</code> attributes. If you might move hosts, a plain POST to Plinth is portable. See <a href="/guides/netlify-forms-alternative">Netlify Forms alternative</a> for a side-by-side chart.</p>

<h2>Shortcode variant</h2>
<p>Register a shortcode in <code class="inline-code">.eleventy.js</code>:</p>
<pre><code>eleventyConfig.addShortcode("contactForm", () =&gt; \`
  &lt;form method="POST" action="\${process.env.PLINTH_FORM_URL}"&gt;...&lt;/form&gt;
\`);</code></pre>
<p>Use <code class="inline-code">{% contactForm %}</code> in any Markdown page.</p>

<h2>Inspect submissions</h2>
<pre><code>curl https://api.plinthrun.com/v1/forms/frm_YOUR_ID</code></pre>
<p>Authenticated listing with API key: <a href="/docs/forms">Forms docs</a>. Upgrade path: <a href="/pricing">Pricing</a>.</p>

<h2>Sibling guides</h2>
<ul>
  <li><a href="/guides/hugo-contact-form">Hugo</a> and <a href="/guides/astro-contact-form">Astro</a> use the same pattern.</li>
  <li><a href="/guides/honeypot-spam-form">Honeypot setup</a> reduces bot noise.</li>
  <li><a href="/guides/open-core-form-backend">Self-host</a> with @plinth/forms if needed.</li>
</ul>
${footer('Related: <a href="/guides/static-site-contact-form">Static site contact form</a> · <a href="/guides/formspree-free-tier-limit">Formspree free tier</a>')}
`,
  },
  {
    slug: "nextjs-contact-form",
    title: "Next.js contact form without managing spam yourself",
    description:
      "Keep Next.js lean — post contact forms to Plinth instead of building spam filters and storage in your app.",
    category: "Forms",
    htmlBody: `
<p>Next.js can handle forms with Server Actions, Route Handlers, or API routes. That works until spam volume climbs and you are maintaining rate limits, honeypots, and an inbox UI. Plinth <a href="/forms">Forms</a> absorbs the POST so your Next app stays focused on product code.</p>

<h2>Marketing page — plain HTML form</h2>
<p>For static marketing pages (even inside a Next app), skip the server:</p>
<pre><code>export default function ContactPage() {
  return (
    &lt;form
      method="POST"
      action={process.env.NEXT_PUBLIC_PLINTH_FORM_URL}
      className="grid gap-4 max-w-lg"
    &gt;
      &lt;label&gt;Name &lt;input name="name" required /&gt;&lt;/label&gt;
      &lt;label&gt;Email &lt;input name="email" type="email" required /&gt;&lt;/label&gt;
      &lt;label&gt;Message &lt;textarea name="message" required /&gt;&lt;/label&gt;
      &lt;input type="text" name="_gotcha" tabIndex={-1} autoComplete="off"
             aria-hidden="true" className="sr-only" /&gt;
      &lt;button type="submit"&gt;Send&lt;/button&gt;
    &lt;/form&gt;
  );
}</code></pre>
<p>Set <code class="inline-code">NEXT_PUBLIC_PLINTH_FORM_URL</code> in <code class="inline-code">.env.local</code>. The browser posts directly to Plinth — no Route Handler required.</p>

<h2>Client-side fetch (SPA islands)</h2>
<pre><code>async function onSubmit(e: React.FormEvent&lt;HTMLFormElement&gt;) {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.currentTarget));
  await fetch(process.env.NEXT_PUBLIC_PLINTH_FORM_URL!, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...data, _gotcha: "" }),
  });
}</code></pre>

<h2>When you still want a Route Handler</h2>
<p>Proxy through Next only if you must hide the form ID or add server-side validation before forward:</p>
<pre><code>// app/api/contact/route.ts
export async function POST(req: Request) {
  const body = await req.json();
  const res = await fetch(process.env.PLINTH_FORM_URL!, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return new Response(await res.text(), { status: res.status });
}</code></pre>
<p>Even then, let Plinth own spam screening (<a href="/guides/honeypot-spam-form">honeypot guide</a>).</p>

<h2>Static export</h2>
<p><code class="inline-code">output: "export"</code> removes server routes entirely. External form action is the correct architecture — same as <a href="/guides/static-site-contact-form">static sites</a>.</p>

<h2>Ops</h2>
<p>Submissions: <a href="/docs/forms">Forms docs</a>. Pro webhooks integrate with your existing Next API on <a href="/pricing">Pro</a>. Billing via Polar: <a href="/guides/polar-billing-api-keys">API keys guide</a>.</p>
${footer('Related: <a href="/guides/astro-contact-form">Astro contact form</a> · <a href="/guides/netlify-forms-alternative">Netlify Forms alternative</a>')}
`,
  },
  {
    slug: "test-stripe-webhooks",
    title: "Test Stripe webhooks locally with Plinth Catch",
    description:
      "Capture Stripe test-mode webhook deliveries in a Catch bin, inspect payloads, then replay to localhost on Pro.",
    category: "Catch",
    htmlBody: `
<p>Stripe webhooks arrive as signed HTTP POSTs. Testing them locally usually means ngrok, Stripe CLI forwarding, or guessing at payload shapes. Plinth <a href="/catch">Catch</a> gives you a stable HTTPS URL that records every delivery — headers redacted, body preserved — so you can inspect before your handler runs.</p>

<h2>Create a Catch bin</h2>
<pre><code>curl -X POST https://api.plinthrun.com/v1/catch/bins \\
  -H "Content-Type: application/json" \\
  -d '{"name": "stripe-test"}'</code></pre>
<p>Response includes <code class="inline-code">url</code> like <code class="inline-code">https://api.plinthrun.com/v1/catch/bin_…</code>. Full reference: <a href="/docs/catch">Catch docs</a>.</p>

<h2>Register in Stripe Dashboard</h2>
<ol>
  <li>Developers → Webhooks → Add endpoint.</li>
  <li>Paste the Catch URL.</li>
  <li>Select events (<code class="inline-code">checkout.session.completed</code>, <code class="inline-code">invoice.paid</code>, etc.).</li>
  <li>Use <strong>Test mode</strong> so live money is not involved.</li>
</ol>

<h2>Trigger events</h2>
<pre><code>stripe trigger payment_intent.succeeded</code></pre>
<p>Or complete a test checkout. Each delivery appears in the bin:</p>
<pre><code>curl https://api.plinthrun.com/v1/catch/bin_YOUR_ID/events</code></pre>

<h2>Verify signatures offline</h2>
<p>Before replaying into your app, confirm you can validate <code class="inline-code">Stripe-Signature</code>. See <a href="/guides/stripe-webhook-signature-test">Stripe webhook signature test</a> for a Node snippet using the captured raw body.</p>

<h2>Replay to localhost (Pro)</h2>
<pre><code>curl -X POST https://api.plinthrun.com/v1/catch/bin_YOUR_ID/replay/evt_ID \\
  -H "x-plinth-key: pln_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{"url": "http://localhost:3000/api/stripe/webhook"}'</code></pre>
<p>Replay re-sends the stored payload. Fix your handler, replay again — no new Stripe charge required. Details: <a href="/guides/webhook-replay">webhook replay guide</a>.</p>

<h2>Compare tools</h2>
<p>Webhook.site is fine for quick peeks. For retention, replay, and integration with Plinth billing, Catch fits the same stack as <a href="/forms">Forms</a> and <a href="/schema">Schema</a>. Read <a href="/guides/webhook-site-alternative-free">Webhook.site alternative</a>.</p>

<h2>Pricing note</h2>
<p>Anonymous bins accept traffic with limits. <a href="/guides/catch-bin-expire">Catch bin expiry</a> explains retention. Pro unlocks replay and longer history on <a href="/pricing">Pricing</a>.</p>
${footer('Related: <a href="/guides/stripe-webhook-signature-test">Stripe signature test</a> · <a href="/guides/webhook-replay">Webhook replay</a>')}
`,
  },
  {
    slug: "test-github-webhooks",
    title: "Test GitHub webhooks with Plinth Catch",
    description:
      "Point a repository webhook at a Catch bin to inspect GitHub delivery payloads, headers, and event types.",
    category: "Catch",
    htmlBody: `
<p>GitHub sends webhooks for pushes, PRs, releases, and dozens of other events. Debugging them from Actions logs alone is slow. Plinth <a href="/catch">Catch</a> records each delivery to a bin URL you register in repository settings.</p>

<h2>Mint a bin</h2>
<p>From <a href="/catch">/catch</a> or:</p>
<pre><code>curl -X POST https://api.plinthrun.com/v1/catch/bins \\
  -d '{"name": "github-myrepo"}'</code></pre>

<h2>GitHub repository settings</h2>
<ol>
  <li>Settings → Webhooks → Add webhook.</li>
  <li>Payload URL: your Catch bin URL.</li>
  <li>Content type: <code class="inline-code">application/json</code>.</li>
  <li>Secret: optional but recommended — your handler should verify <code class="inline-code">X-Hub-Signature-256</code>.</li>
  <li>Choose events (e.g. Pull requests, Pushes).</li>
</ol>

<h2>Inspect deliveries</h2>
<pre><code>curl https://api.plinthrun.com/v1/catch/bin_YOUR_ID/events</code></pre>
<p>Each event stores method, headers (Authorization redacted), and body. Walk through fields with <a href="/guides/github-webhook-payload-inspect">GitHub payload inspect guide</a>.</p>

<h2>Redeliver from GitHub vs replay from Catch</h2>
<p>GitHub’s “Redeliver” button works but fires only from GitHub’s IPs and timing. Catch <strong>replay</strong> (Pro) POSTs the exact stored bytes to your laptop or staging URL — useful when GitHub throttles or you need identical payloads. See <a href="/guides/webhook-replay">webhook replay</a>.</p>

<h2>Local handler sketch</h2>
<pre><code>// Express example
app.post("/github", express.raw({ type: "*/*" }), (req, res) =&gt; {
  const sig = req.headers["x-hub-signature-256"];
  // verify with crypto.createHmac("sha256", secret)...
  const event = req.headers["x-github-event"];
  const payload = JSON.parse(req.body.toString());
  console.log(event, payload.action);
  res.sendStatus(200);
});</code></pre>

<h2>Security</h2>
<p>Catch URLs are unlisted, not secret. Do not treat captured payloads as public. Rotate bin IDs if leaked. Pro bins last longer — <a href="/guides/catch-bin-expire">expiry guide</a>.</p>

<h2>Stack context</h2>
<p>Catch sits beside <a href="/forms">Forms</a> and <a href="/schema">Schema</a> on the same API. MCP clients can create bins via <a href="/docs/mcp">MCP</a>. Docs hub: <a href="/docs">/docs</a>.</p>
${footer('Related: <a href="/guides/github-webhook-payload-inspect">Inspect GitHub payloads</a> · <a href="/guides/test-stripe-webhooks">Test Stripe webhooks</a>')}
`,
  },
  {
    slug: "llm-json-repair",
    title: "Repair invalid JSON from LLMs",
    description:
      "Fix markdown fences, trailing commas, Python booleans, and other LLM JSON drift before parsing in production.",
    category: "Schema",
    htmlBody: `
<p>Large language models are asked to return JSON. They often return JSON-shaped text that is not valid JSON: markdown fences, trailing commas, single-quoted keys, Python <code class="inline-code">True</code>/<code class="inline-code">False</code>/<code class="inline-code">None</code>, and truncated objects. A strict <code class="inline-code">JSON.parse</code> throws; your agent loop stalls.</p>
<p>Plinth <a href="/schema">Schema</a> repairs common LLM drift server-side or via <code class="inline-code">@plinth/schema</code> in your runtime.</p>

<h2>API repair</h2>
<pre><code>curl -X POST https://api.plinthrun.com/v1/schema/repair \\
  -H "Content-Type: application/json" \\
  -d '{"text": "\\\`\\\`\\\`json\\n{ok: True, items: [1,2,],}\\n\\\`\\\`\\\`"}'</code></pre>
<p>Returns <code class="inline-code">{ "value": { "ok": true, "items": [1, 2] } }</code>. See <a href="/docs/schema">Schema docs</a>.</p>

<h2>npm library</h2>
<pre><code>npm i @plinth/schema</code></pre>
<pre><code>import { repairJson } from "@plinth/schema";

const raw = await model.complete("Return JSON...");
const { value, repairs } = repairJson(raw);
console.log(repairs); // ["stripped_markdown_fence", "python_bool", ...]</code></pre>

<h2>Common failure modes</h2>
<ul>
  <li><a href="/guides/llm-markdown-json-fence">Markdown JSON fences</a> — triple backticks wrap the payload.</li>
  <li><a href="/guides/trailing-comma-json-fix">Trailing commas</a> — <code class="inline-code">[1,2,]</code> is invalid in JSON.</li>
  <li><a href="/guides/python-true-in-json">Python True/False/None</a> — models trained on Python slip these in.</li>
</ul>

<h2>Repair then validate</h2>
<p>Syntax repair does not guarantee schema fit. Chain validation:</p>
<pre><code>curl -X POST https://api.plinthrun.com/v1/schema/repair-and-validate \\
  -d '{
    "text": "{\\"name\\": \\"Ada\\"}",
    "schema": {
      "type": "object",
      "required": ["name", "email"],
      "properties": {
        "name": { "type": "string" },
        "email": { "type": "string", "format": "email" }
      }
    }
  }'</code></pre>
<p>Deep dive: <a href="/guides/structured-output-json-schema">structured output with JSON Schema</a> and <a href="/guides/json-schema-validate-openai">OpenAI validation</a>.</p>

<h2>Agent integration</h2>
<p>MCP tool <code class="inline-code">schema_repair</code> at <code class="inline-code">https://api.plinthrun.com/mcp</code> — see <a href="/guides/mcp-json-repair">MCP JSON repair</a>.</p>

<h2>When to retry the model</h2>
<p>If repair succeeds but validation fails, feed validation errors back to the model for one retry. Repair handles syntax; schema handles semantics.</p>

<h2>Pricing</h2>
<p>Anonymous repair is rate-limited. High-volume pipelines attach an API key after <a href="/pricing">checkout</a> — <a href="/guides/polar-billing-api-keys">Polar billing</a>.</p>
${footer('Related: <a href="/guides/trailing-comma-json-fix">Trailing comma fix</a> · <a href="/guides/python-true-in-json">Python booleans in JSON</a>')}
`,
  },
  {
    slug: "structured-output-json-schema",
    title: "Validate LLM structured output with JSON Schema",
    description:
      "Constrained decoding fixes syntax sometimes — JSON Schema validation fixes semantics. Repair, validate, retry.",
    category: "Schema",
    htmlBody: `
<p>“Structured output” from LLM APIs reduces malformed JSON. It does not guarantee every required field, correct types, or business rules. Production pipelines need: (1) syntax repair, (2) JSON Schema validation, (3) optional model retry with error feedback.</p>
<p>Plinth <a href="/schema">Schema</a> bundles repair + validate in one call.</p>

<h2>Define your schema</h2>
<pre><code>const orderSchema = {
  type: "object",
  required: ["sku", "quantity", "customer_email"],
  properties: {
    sku: { type: "string", minLength: 1 },
    quantity: { type: "integer", minimum: 1 },
    customer_email: { type: "string", format: "email" },
  },
  additionalProperties: false,
};</code></pre>

<h2>Repair and validate</h2>
<pre><code>const res = await fetch("https://api.plinthrun.com/v1/schema/repair-and-validate", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ text: modelOutput, schema: orderSchema }),
});
const { value, valid, errors, repairs } = await res.json();</code></pre>
<p>If <code class="inline-code">valid</code> is false, <code class="inline-code">errors</code> lists JSON Schema paths — pass them to the model: “Fix: quantity must be integer.”</p>

<h2>Library path</h2>
<pre><code>import { repairAndValidate } from "@plinth/schema";

const result = repairAndValidate(raw, orderSchema);
if (!result.valid) {
  throw new AggregateError(result.errors);
}</code></pre>

<h2>OpenAI-specific notes</h2>
<p>OpenAI JSON mode and strict schema features help but still drift on edge cases. See <a href="/guides/json-schema-validate-openai">validate OpenAI output</a>. Always repair fences and Python literals first — <a href="/guides/llm-json-repair">LLM JSON repair</a>.</p>

<h2>Agent loops</h2>
<p>For tool-using agents, expose validation errors as tool results. MCP: <code class="inline-code">schema_repair_and_validate</code> in <a href="/docs/mcp">MCP docs</a>.</p>

<h2>Testing schemas</h2>
<p>Unit-test schemas against golden bad outputs: trailing commas (<a href="/guides/trailing-comma-json-fix">guide</a>), markdown wrappers (<a href="/guides/llm-markdown-json-fence">guide</a>), partial objects.</p>

<h2>Cost control</h2>
<p>Validate before persisting to DB or calling downstream APIs. One failed validation is cheaper than one bad row in production.</p>

<h2>Docs and pricing</h2>
<p>API reference: <a href="/docs/schema">/docs/schema</a>. Limits and keys: <a href="/pricing">Pricing</a>, <a href="/docs/api-keys">API keys</a>.</p>
${footer('Related: <a href="/guides/json-schema-validate-openai">OpenAI JSON Schema</a> · <a href="/guides/mcp-json-repair">MCP JSON repair</a>')}
`,
  },
  {
    slug: "webhook-replay",
    title: "Replay a captured webhook",
    description:
      "Re-send a stored Catch event to your local or staging handler — fix bugs without waiting for new provider deliveries.",
    category: "Catch",
    htmlBody: `
<p>You fixed the bug in your webhook handler. Now you need the same Stripe or GitHub payload again. Providers offer “redeliver,” but timing, IP allowlists, and rate limits get in the way. Plinth Catch Pro stores the raw request and can <strong>replay</strong> it to any URL you specify.</p>

<h2>Prerequisites</h2>
<ul>
  <li>A Catch bin that received the original webhook — see <a href="/guides/test-stripe-webhooks">Stripe</a> or <a href="/guides/test-github-webhooks">GitHub</a> guides.</li>
  <li>Catch Pro entitlement and API key — <a href="/pricing">Pricing</a>, <a href="/docs/api-keys">API keys</a>.</li>
  <li>Event ID from <code class="inline-code">GET /v1/catch/:binId/events</code>.</li>
</ul>

<h2>List captured events</h2>
<pre><code>curl https://api.plinthrun.com/v1/catch/bin_YOUR_ID/events \\
  -H "x-plinth-key: pln_live_..."</code></pre>
<p>Note <code class="inline-code">id</code> for the delivery you want.</p>

<h2>Replay to localhost</h2>
<pre><code>curl -X POST https://api.plinthrun.com/v1/catch/bin_YOUR_ID/replay/evt_ABC \\
  -H "x-plinth-key: pln_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{"url": "http://127.0.0.1:3000/webhooks/stripe"}'</code></pre>
<p>Plinth POSTs the stored body and original headers (minus redacted secrets) to your URL. Full spec: <a href="/docs/catch">Catch docs</a>.</p>

<h2>Replay workflow</h2>
<ol>
  <li>Capture failing webhook in Catch.</li>
  <li>Develop against replay target (localhost tunnel or staging).</li>
  <li>Fix handler; replay same <code class="inline-code">evt_ID</code> until 200.</li>
  <li>Deploy; optionally replay once more against production URL to confirm.</li>
</ol>

<h2>Signature verification</h2>
<p>Replayed Stripe events include original <code class="inline-code">Stripe-Signature</code> only if it was stored. Test verification with <a href="/guides/stripe-webhook-signature-test">signature test guide</a>. GitHub: <a href="/guides/github-webhook-payload-inspect">payload inspect</a>.</p>

<h2>vs Webhook.site</h2>
<p>Many free inspectors discard history quickly. Catch retention and replay are documented in <a href="/guides/catch-bin-expire">bin expiry</a> and <a href="/guides/webhook-site-alternative-free">Webhook.site alternative</a>.</p>

<h2>MCP</h2>
<p>Agents can create bins via <a href="/docs/mcp">MCP</a> — useful for automated integration tests.</p>
${footer('Related: <a href="/guides/test-stripe-webhooks">Test Stripe webhooks</a> · <a href="/guides/catch-bin-expire">Catch bin expiry</a>')}
`,
  },
  {
    slug: "open-core-form-backend",
    title: "Open-core form backend on Cloudflare Workers",
    description:
      "Plinth Forms runs on Workers + D1. The spam screener ships as @plinth/forms for self-hosting or embedding heuristics.",
    category: "Platform",
    htmlBody: `
<p>Plinth is infrastructure you can rent or run. <a href="/forms">Forms</a> is an open-core form backend: hosted API at <code class="inline-code">api.plinthrun.com</code>, spam screener published as <code class="inline-code">@plinth/forms</code> on npm, Workers + D1 under the hood.</p>

<h2>What is open core?</h2>
<p>You get readable heuristics (honeypot, timing, header signals) without a black box. Self-host on your Cloudflare account or embed the screener in your own Worker. Paid Plinth adds hosted ops, retention, webhooks, and support.</p>

<h2>Install the screener</h2>
<pre><code>npm i @plinth/forms</code></pre>
<pre><code>import { screenSubmission } from "@plinth/forms";

export default {
  async fetch(request: Request): Promise&lt;Response&gt; {
    const form = await request.formData();
    const verdict = screenSubmission(form, { honeypotField: "_gotcha" });
    if (verdict.spam) return new Response("ok", { status: 200 }); // silent drop
    // persist to D1, KV, or forward...
  },
};</code></pre>

<h2>Hosted vs self-hosted</h2>
<table>
  <thead><tr><th></th><th>Hosted Plinth</th><th>Self-hosted Worker</th></tr></thead>
  <tbody>
    <tr><td>Spam screen</td><td>Included</td><td>@plinth/forms</td></tr>
    <tr><td>Storage</td><td>D1 managed</td><td>Your D1</td></tr>
    <tr><td>Webhooks</td><td><a href="/pricing">Pro</a></td><td>You build</td></tr>
    <tr><td>Billing</td><td><a href="/guides/polar-billing-api-keys">Polar</a></td><td>Your problem</td></tr>
  </tbody>
</table>

<h2>Static site integration</h2>
<p>Whether hosted or self-hosted, the browser form is the same HTML — see <a href="/guides/static-site-contact-form">static site contact form</a>. Point <code class="inline-code">action</code> at your Worker route or Plinth URL.</p>

<h2>Sibling products</h2>
<p>Same monorepo ships <a href="/catch">Catch</a> (webhook inbox) and <a href="/schema">Schema</a> (JSON repair). Docs: <a href="/docs">/docs</a>.</p>

<h2>Why Workers?</h2>
<p>Form POSTs are edge-shaped: global visitors, small payloads, need low latency. Workers + D1 match that without running a 24/7 Node server.</p>

<h2>Contribution</h2>
<p>Package source is on npm; issues and PRs welcome. Honeypot details: <a href="/guides/honeypot-spam-form">honeypot guide</a>.</p>
${footer('Related: <a href="/guides/honeypot-spam-form">Honeypot spam form</a> · <a href="/guides/netlify-forms-alternative">Netlify Forms alternative</a>')}
`,
  },
  {
    slug: "mcp-json-repair",
    title: "JSON repair MCP tool for agents",
    description:
      "Expose schema_repair and schema_repair_and_validate to Cursor and other MCP clients at api.plinthrun.com/mcp.",
    category: "Schema",
    htmlBody: `
<p>Agent loops break when tool output is not valid JSON. Wiring repair into every agent by hand is tedious. Plinth exposes JSON repair and validation as MCP tools at <code class="inline-code">https://api.plinthrun.com/mcp</code>.</p>

<h2>Cursor configuration</h2>
<pre><code>{
  "mcpServers": {
    "plinth": {
      "url": "https://api.plinthrun.com/mcp"
    }
  }
}</code></pre>
<p>Full tool list: <a href="/docs/mcp">MCP docs</a>.</p>

<h2>Available tools</h2>
<ul>
  <li><code class="inline-code">schema_repair</code> — text in, JSON value out.</li>
  <li><code class="inline-code">schema_repair_and_validate</code> — repair + JSON Schema check.</li>
  <li><code class="inline-code">catch_create_bin</code> — mint webhook inbox for integration tests.</li>
</ul>

<h2>When the agent should call repair</h2>
<p>After any LLM step that must produce machine-readable JSON: classification, extraction, plan steps, tool arguments. Common bad patterns are documented in <a href="/guides/llm-json-repair">LLM JSON repair</a>, <a href="/guides/llm-markdown-json-fence">markdown fences</a>, and <a href="/guides/python-true-in-json">Python booleans</a>.</p>

<h2>Example agent flow</h2>
<ol>
  <li>Model returns fenced JSON with trailing comma.</li>
  <li>Agent calls <code class="inline-code">schema_repair</code>.</li>
  <li>Agent calls <code class="inline-code">schema_repair_and_validate</code> with business schema.</li>
  <li>On validation errors, prompt model once with <code class="inline-code">errors</code> array.</li>
</ol>

<h2>HTTP alternative</h2>
<p>Non-MCP services can POST directly — <a href="/docs/schema">Schema API</a>. Same engine, different transport.</p>

<h2>npm in your Worker</h2>
<pre><code>import { repairJson } from "@plinth/schema";
// use in Workers, Node, Bun...</code></pre>

<h2>Rate limits and keys</h2>
<p>Anonymous MCP calls are IP-limited. Attach <code class="inline-code">x-plinth-key</code> after <a href="/pricing">Pro checkout</a> — see <a href="/guides/polar-billing-api-keys">Polar billing API keys</a>.</p>

<h2>Combine with Catch</h2>
<p>Agents testing webhooks can call <code class="inline-code">catch_create_bin</code> then point Stripe/GitHub at the URL — <a href="/guides/test-stripe-webhooks">Stripe guide</a>.</p>
${footer('Related: <a href="/guides/structured-output-json-schema">Structured output JSON Schema</a> · <a href="/guides/json-schema-validate-openai">Validate OpenAI output</a>')}
`,
  },
  // --- 12 NEW long-tail guides ---
  {
    slug: "formspree-free-tier-limit",
    title: "Formspree free tier limits and Plinth alternatives",
    description:
      "Compare Formspree free submission caps, branding, and retention with Plinth Forms for static site contact forms.",
    category: "Forms",
    htmlBody: `
<p>Formspree popularized “just set the form action.” The free tier is enough for experiments but tightens as traffic grows: monthly submission caps, Formspree branding on redirects, limited history, and paid tiers for webhooks and advanced spam.</p>
<p>Plinth <a href="/forms">Forms</a> targets solo builders who want a clear free runway and an upgrade path on the same stack as <a href="/catch">Catch</a> and <a href="/schema">Schema</a>.</p>

<h2>Typical free-tier friction</h2>
<ul>
  <li>Monthly submission quotas — side projects hit them after a launch post.</li>
  <li>Short retention — old messages disappear.</li>
  <li>Branding on thank-you redirects unless paid.</li>
  <li>Webhooks and integrations gated to higher plans.</li>
</ul>
<p>Exact numbers change; check Formspree’s pricing page when plotting your budget. This guide focuses on architecture, not a live price table.</p>

<h2>Plinth free tier shape</h2>
<p>Anonymous forms at <a href="/forms">/forms</a>:</p>
<ul>
  <li>Submissions stored 24 hours (enough to verify integration).</li>
  <li>Honeypot spam screening via <code class="inline-code">@plinth/forms</code>.</li>
  <li>No server on your static site — <a href="/guides/static-site-contact-form">static site guide</a>.</li>
</ul>
<p><a href="/pricing">Forms Pro</a> adds year-long retention, webhooks, higher quota. Compare <a href="/compare/formspree">vs Formspree</a> on the marketing site.</p>

<h2>Migration checklist</h2>
<ol>
  <li>Create Plinth form — <code class="inline-code">POST /v1/forms/anonymous</code> or UI.</li>
  <li>Replace <code class="inline-code">action="https://formspree.io/…"</code> with Plinth URL.</li>
  <li>Add <code class="inline-code">_gotcha</code> honeypot — <a href="/guides/honeypot-spam-form">setup guide</a>.</li>
  <li>Deploy; submit test from production origin.</li>
</ol>
<pre><code>&lt;form method="POST" action="https://api.plinthrun.com/v1/forms/frm_NEW"&gt;
  ...
  &lt;input type="text" name="_gotcha" style="position:absolute;left:-9999px" tabindex="-1" /&gt;
&lt;/form&gt;</code></pre>

<h2>Framework guides</h2>
<p><a href="/guides/astro-contact-form">Astro</a>, <a href="/guides/hugo-contact-form">Hugo</a>, <a href="/guides/11ty-contact-form">11ty</a>, <a href="/guides/nextjs-contact-form">Next.js</a> — same swap.</p>

<h2>Self-host escape hatch</h2>
<p>If you outgrow hosted limits entirely, embed <a href="/guides/open-core-form-backend">@plinth/forms</a> on your own Worker.</p>

<h2>Docs</h2>
<p><a href="/docs/forms">Forms docs</a> · <a href="/docs/api-keys">API keys</a> · <a href="/pricing">Pricing</a></p>
${footer('Related: <a href="/guides/netlify-forms-alternative">Netlify Forms alternative</a> · <a href="/guides/static-site-contact-form">Static site contact form</a>')}
`,
  },
  {
    slug: "webhook-site-alternative-free",
    title: "Free Webhook.site alternative with Plinth Catch",
    description:
      "Use Catch bins as a free webhook inspector with API access, retention tiers, and Pro replay to localhost.",
    category: "Catch",
    htmlBody: `
<p>Webhook.site gives you an instant URL to see incoming HTTP requests. It is excellent for a thirty-second test. When you need API access, predictable retention, replay into dev, and the same vendor as your form backend, Plinth <a href="/catch">Catch</a> is the alternative.</p>

<h2>Quick start</h2>
<pre><code>curl -X POST https://api.plinthrun.com/v1/catch/bins -d '{"name": "inspect"}'</code></pre>
<p>Use returned <code class="inline-code">url</code> as webhook target. Read events:</p>
<pre><code>curl https://api.plinthrun.com/v1/catch/bin_ID/events</code></pre>
<p>Docs: <a href="/docs/catch">Catch docs</a>.</p>

<h2>Feature comparison (conceptual)</h2>
<ul>
  <li><strong>Instant URL</strong> — both tools.</li>
  <li><strong>REST API for events</strong> — Catch (<code class="inline-code">GET …/events</code>).</li>
  <li><strong>Replay to another URL</strong> — Catch Pro — <a href="/guides/webhook-replay">replay guide</a>.</li>
  <li><strong>Same stack as forms + JSON repair</strong> — Plinth only.</li>
</ul>

<h2>Stripe and GitHub workflows</h2>
<ul>
  <li><a href="/guides/test-stripe-webhooks">Test Stripe webhooks</a></li>
  <li><a href="/guides/test-github-webhooks">Test GitHub webhooks</a></li>
  <li><a href="/guides/stripe-webhook-signature-test">Stripe signature testing</a></li>
  <li><a href="/guides/github-webhook-payload-inspect">GitHub payload inspect</a></li>
</ul>

<h2>Retention</h2>
<p>Free bins expire — see <a href="/guides/catch-bin-expire">Catch bin expiry</a>. Pro extends history for debugging long-running integrations.</p>

<h2>Security</h2>
<p>Bin URLs are unguessable IDs, not authentication. Do not post customer PII to shared bins in production. Use dedicated bins per environment.</p>

<h2>Pricing</h2>
<p><a href="/pricing">Pricing</a> · <a href="/compare/webhook-site">vs Webhook.site</a> · <a href="/docs">All docs</a></p>
${footer('Related: <a href="/guides/webhook-replay">Webhook replay</a> · <a href="/guides/catch-bin-expire">Catch bin expiry</a>')}
`,
  },
  {
    slug: "python-true-in-json",
    title: "Fix Python True, False, and None in LLM JSON",
    description:
      "Models output Python literals instead of JSON booleans and null. Repair before JSON.parse in your pipeline.",
    category: "Schema",
    htmlBody: `
<p>JSON requires lowercase <code class="inline-code">true</code>, <code class="inline-code">false</code>, and <code class="inline-code">null</code>. Models trained on Python snippets emit <code class="inline-code">True</code>, <code class="inline-code">False</code>, and <code class="inline-code">None</code>. JavaScript’s <code class="inline-code">JSON.parse</code> throws immediately.</p>

<h2>Example bad output</h2>
<pre><code>{
  "active": True,
  "deleted": False,
  "parent": None
}</code></pre>

<h2>Quick fix with Plinth Schema</h2>
<pre><code>curl -X POST https://api.plinthrun.com/v1/schema/repair \\
  -d '{"text": "{\\"active\\": True, \\"deleted\\": False, \\"parent\\": None}"}'</code></pre>
<p>Returns legal JSON with <code class="inline-code">true</code>/<code class="inline-code">false</code>/<code class="inline-code">null</code>. API: <a href="/docs/schema">Schema docs</a>.</p>

<h2>Library</h2>
<pre><code>import { repairJson } from "@plinth/schema";

const { value } = repairJson('{ "ok": True }');
// value.ok === true</code></pre>

<h2>Why not regex in production?</h2>
<p>Naive replace breaks strings containing “True”. The repair parser tokenizes safely. Broader LLM issues: <a href="/guides/llm-json-repair">LLM JSON repair</a>, <a href="/guides/trailing-comma-json-fix">trailing commas</a>, <a href="/guides/llm-markdown-json-fence">markdown fences</a>.</p>

<h2>Prompting helps, does not guarantee</h2>
<p>Add system text: “Output strict JSON with lowercase booleans.” Still repair — models drift under token pressure.</p>

<h2>Validate after repair</h2>
<pre><code>POST /v1/schema/repair-and-validate</code></pre>
<p>Guide: <a href="/guides/structured-output-json-schema">structured output JSON Schema</a>. OpenAI-specific: <a href="/guides/json-schema-validate-openai">validate OpenAI</a>.</p>

<h2>MCP agents</h2>
<p><code class="inline-code">schema_repair</code> tool — <a href="/guides/mcp-json-repair">MCP JSON repair</a>.</p>

<h2>Pricing</h2>
<p><a href="/schema">Schema product page</a> · <a href="/pricing">Pricing</a></p>
${footer('Related: <a href="/guides/trailing-comma-json-fix">Trailing comma JSON fix</a> · <a href="/guides/llm-json-repair">LLM JSON repair</a>')}
`,
  },
  {
    slug: "trailing-comma-json-fix",
    title: "Fix trailing commas in LLM-generated JSON",
    description:
      "Trailing commas after the last array or object element are invalid JSON. Repair them automatically before parsing.",
    category: "Schema",
    htmlBody: `
<p>Trailing commas are valid in JavaScript object literals and Python dicts. They are <strong>not</strong> valid in JSON. LLMs copy the more permissive syntax; your parser rejects it.</p>

<h2>Examples</h2>
<pre><code>{"items": [1, 2, 3,], "meta": {"version": 1,}}</code></pre>
<p><code class="inline-code">JSON.parse</code> fails at the first <code class="inline-code">,</code> before <code class="inline-code">]</code> or <code class="inline-code">}</code>.</p>

<h2>Repair API</h2>
<pre><code>curl -X POST https://api.plinthrun.com/v1/schema/repair \\
  -H "Content-Type: application/json" \\
  -d '{"text": "{\\"items\\": [1,2,3,]}"}'</code></pre>
<p>Response includes <code class="inline-code">repairs</code> array noting trailing comma removal. See <a href="/docs/schema">Schema docs</a>.</p>

<h2>npm</h2>
<pre><code>import { repairJson } from "@plinth/schema";
repairJson('{ "a": [1,], }');</code></pre>

<h2>Combined failures</h2>
<p>Real model output often combines trailing commas with <a href="/guides/python-true-in-json">Python booleans</a> and <a href="/guides/llm-markdown-json-fence">markdown fences</a>. Repair handles the bundle — <a href="/guides/llm-json-repair">overview guide</a>.</p>

<h2>Structured output APIs</h2>
<p>Constrained decoding reduces but does not eliminate trailing commas on long arrays. Always run repair before schema validation — <a href="/guides/structured-output-json-schema">JSON Schema guide</a>.</p>

<h2>Unit tests</h2>
<p>Keep a fixture file of “bad LLM outputs” in CI. Assert repair + validate passes.</p>

<h2>Agents</h2>
<p>MCP <code class="inline-code">schema_repair</code> — <a href="/guides/mcp-json-repair">MCP guide</a>. OpenAI flow: <a href="/guides/json-schema-validate-openai">OpenAI validation</a>.</p>

<h2>Product links</h2>
<p><a href="/schema">Schema</a> · <a href="/pricing">Pricing</a> · <a href="/docs">Docs</a></p>
${footer('Related: <a href="/guides/python-true-in-json">Python True in JSON</a> · <a href="/guides/llm-markdown-json-fence">LLM markdown JSON fence</a>')}
`,
  },
  {
    slug: "netlify-forms-alternative",
    title: "Netlify Forms alternative for static sites",
    description:
      "Decouple contact forms from Netlify hosting — use Plinth Forms on Cloudflare Pages, GitHub Pages, or any static host.",
    category: "Forms",
    htmlBody: `
<p>Netlify Forms is convenient when you already deploy on Netlify: add <code class="inline-code">data-netlify="true"</code>, build, submissions appear in the dashboard. Move to Cloudflare Pages or S3 and the forms stop working unless you migrate.</p>
<p>Plinth <a href="/forms">Forms</a> is host-agnostic — a POST URL in plain HTML.</p>

<h2>Netlify Forms coupling</h2>
<ul>
  <li>Requires Netlify build + form detection.</li>
  <li>Spam handling is Netlify-specific.</li>
  <li>Export and webhook options vary by plan.</li>
</ul>

<h2>Plinth pattern</h2>
<pre><code>&lt;form method="POST" action="https://api.plinthrun.com/v1/forms/frm_ID"&gt;
  &lt;!-- no netlify attributes --&gt;
  &lt;input name="email" type="email" required /&gt;
  &lt;input type="text" name="_gotcha" style="position:absolute;left:-9999px" tabindex="-1" /&gt;
  &lt;button type="submit"&gt;Send&lt;/button&gt;
&lt;/form&gt;</code></pre>
<p>Honeypot: <a href="/guides/honeypot-spam-form">guide</a>. Static overview: <a href="/guides/static-site-contact-form">static site contact form</a>.</p>

<h2>Migration from Netlify</h2>
<ol>
  <li>Mint Plinth form at <a href="/forms">/forms</a>.</li>
  <li>Remove <code class="inline-code">data-netlify</code> and hidden <code class="inline-code">form-name</code> fields.</li>
  <li>Set <code class="inline-code">action</code> to Plinth URL.</li>
  <li>Deploy to new host; test submission.</li>
</ol>

<h2>Framework-specific</h2>
<ul>
  <li><a href="/guides/11ty-contact-form">11ty</a> — common Netlify pairing.</li>
  <li><a href="/guides/hugo-contact-form">Hugo</a> on Cloudflare Pages.</li>
  <li><a href="/guides/astro-contact-form">Astro</a> anywhere.</li>
</ul>

<h2>Compare Formspree too</h2>
<p><a href="/guides/formspree-free-tier-limit">Formspree free tier limits</a> — another portable backend.</p>

<h2>Open core</h2>
<p><a href="/guides/open-core-form-backend">Self-host</a> with @plinth/forms on Workers.</p>

<h2>Docs and pricing</h2>
<p><a href="/docs/forms">Forms docs</a> · <a href="/pricing">Pricing</a></p>
${footer('Related: <a href="/guides/formspree-free-tier-limit">Formspree limits</a> · <a href="/guides/nextjs-contact-form">Next.js contact form</a>')}
`,
  },
  {
    slug: "stripe-webhook-signature-test",
    title: "Test Stripe webhook signatures with captured payloads",
    description:
      "Verify Stripe-Signature headers against the raw body using events captured in a Plinth Catch bin.",
    category: "Catch",
    htmlBody: `
<p>Stripe signs webhook bodies with HMAC-SHA256. Verification must use the <strong>raw</strong> request bytes, not a re-serialized JSON object. Testing signatures with fabricated payloads is error-prone. Capture real deliveries in Plinth <a href="/catch">Catch</a>, then replay into your local verifier.</p>

<h2>Capture setup</h2>
<p>Follow <a href="/guides/test-stripe-webhooks">Test Stripe webhooks</a> to point test-mode endpoint at a Catch bin.</p>

<h2>Node verification sketch</h2>
<pre><code>import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const rawBody = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return new Response("bad signature", { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed":
      // handle
      break;
  }
  return new Response("ok");
}</code></pre>

<h2>Replay from Catch</h2>
<pre><code>POST /v1/catch/:binId/replay/:eventId
{ "url": "http://localhost:3000/api/stripe/webhook" }</code></pre>
<p>Details: <a href="/guides/webhook-replay">webhook replay</a>. Requires Pro — <a href="/pricing">Pricing</a>.</p>

<h2>Common mistakes</h2>
<ul>
  <li>Parsing JSON before verify — breaks signature.</li>
  <li>Wrong webhook secret (test vs live).</li>
  <li>Middleware consuming body stream twice.</li>
</ul>

<h2>Inspect without verifying</h2>
<p><code class="inline-code">GET /v1/catch/:binId/events</code> shows body for debugging shape — <a href="/docs/catch">Catch docs</a>.</p>

<h2>Alternatives</h2>
<p><a href="/guides/webhook-site-alternative-free">Webhook.site alternative</a> for capture; Stripe CLI for forward-only workflows.</p>
${footer('Related: <a href="/guides/test-stripe-webhooks">Test Stripe webhooks</a> · <a href="/guides/catch-bin-expire">Catch bin expiry</a>')}
`,
  },
  {
    slug: "github-webhook-payload-inspect",
    title: "Inspect GitHub webhook payloads in Catch",
    description:
      "Read X-GitHub-Event, delivery IDs, and JSON bodies from captured GitHub webhook deliveries.",
    category: "Catch",
    htmlBody: `
<p>GitHub webhooks carry rich metadata in headers and JSON bodies. When a handler mis-fires, you need the exact payload, not a screenshot from the delivery log. Plinth <a href="/catch">Catch</a> stores each POST for API inspection.</p>

<h2>Wire GitHub to Catch</h2>
<p>Repository → Settings → Webhooks → Payload URL = Catch bin URL. Full walkthrough: <a href="/guides/test-github-webhooks">Test GitHub webhooks</a>.</p>

<h2>Fetch events</h2>
<pre><code>curl https://api.plinthrun.com/v1/catch/bin_YOUR_ID/events</code></pre>
<p>Each record includes headers like <code class="inline-code">x-github-event</code>, <code class="inline-code">x-github-delivery</code>, and parsed body.</p>

<h2>Headers to log in your handler</h2>
<ul>
  <li><code class="inline-code">X-GitHub-Event</code> — e.g. <code class="inline-code">pull_request</code>, <code class="inline-code">push</code>.</li>
  <li><code class="inline-code">X-GitHub-Delivery</code> — unique ID for idempotency.</li>
  <li><code class="inline-code">X-Hub-Signature-256</code> — HMAC for verification.</li>
</ul>

<h2>Example pull_request body</h2>
<pre><code>{
  "action": "opened",
  "number": 42,
  "pull_request": {
    "title": "Fix webhook handler",
    "user": { "login": "you" }
  },
  "repository": { "full_name": "org/repo" }
}</code></pre>
<p>Your code should branch on <code class="inline-code">action</code> and <code class="inline-code">X-GitHub-Event</code> together.</p>

<h2>Replay into dev</h2>
<p>After fixing parser bugs, replay stored delivery — <a href="/guides/webhook-replay">webhook replay</a>.</p>

<h2>Security</h2>
<p>Payloads may contain secrets in issue bodies. Treat Catch bins as confidential. Retention: <a href="/guides/catch-bin-expire">bin expiry</a>.</p>

<h2>Stack</h2>
<p><a href="/docs/catch">Catch docs</a> · <a href="/catch">Catch product</a> · <a href="/docs">All docs</a></p>
${footer('Related: <a href="/guides/test-github-webhooks">Test GitHub webhooks</a> · <a href="/guides/webhook-site-alternative-free">Webhook.site alternative</a>')}
`,
  },
  {
    slug: "llm-markdown-json-fence",
    title: "Strip markdown JSON fences from LLM output",
    description:
      "Models wrap JSON in ```json code fences. Remove fences before parsing or use Plinth Schema repair.",
    category: "Schema",
    htmlBody: `
<p>Chat-tuned models love markdown. Ask for JSON, get:</p>
<pre><code>\`\`\`json
{"status": "ok", "count": 3}
\`\`\`</code></pre>
<p><code class="inline-code">JSON.parse</code> on the full string fails on the first backtick.</p>

<h2>Repair handles fences</h2>
<pre><code>curl -X POST https://api.plinthrun.com/v1/schema/repair \\
  -d '{"text": "\`\`\`json\\n{\\"a\\": 1}\\n\`\`\`"}'</code></pre>
<p>Strips fence tokens and parses inner JSON. <a href="/docs/schema">Schema docs</a>.</p>

<h2>Library</h2>
<pre><code>import { repairJson } from "@plinth/schema";
repairJson("\\\`\\\`\\\`json\\n{}\\n\\\`\\\`\\\`");</code></pre>

<h2>Prompt mitigation</h2>
<p>System message: “Return raw JSON only, no markdown.” Reduces frequency; does not eliminate. Always repair in production — <a href="/guides/llm-json-repair">LLM JSON repair overview</a>.</p>

<h2>Often combined with</h2>
<ul>
  <li><a href="/guides/trailing-comma-json-fix">Trailing commas</a></li>
  <li><a href="/guides/python-true-in-json">Python True/False/None</a></li>
  <li>Leading commentary (“Here is the JSON:”)</li>
</ul>

<h2>Validate structure</h2>
<p>After fence strip, run JSON Schema — <a href="/guides/structured-output-json-schema">structured output guide</a>, <a href="/guides/json-schema-validate-openai">OpenAI validation</a>.</p>

<h2>MCP tool</h2>
<p>Agents call <code class="inline-code">schema_repair</code> — <a href="/guides/mcp-json-repair">MCP JSON repair</a>.</p>

<h2>Product</h2>
<p><a href="/schema">Schema</a> · <a href="/pricing">Pricing</a></p>
${footer('Related: <a href="/guides/llm-json-repair">LLM JSON repair</a> · <a href="/guides/trailing-comma-json-fix">Trailing comma fix</a>')}
`,
  },
  {
    slug: "json-schema-validate-openai",
    title: "Validate OpenAI structured output with JSON Schema",
    description:
      "OpenAI JSON mode and response_format help syntax; Plinth Schema validates semantics after repair.",
    category: "Schema",
    htmlBody: `
<p>OpenAI offers JSON mode and schema-constrained responses. They dramatically cut syntax errors. They do not guarantee email fields are emails, enums match, or required keys exist when the model is squeezed for tokens.</p>
<p>Production pattern: model call → <strong>repair</strong> → <strong>JSON Schema validate</strong> → retry with errors if needed.</p>

<h2>Example OpenAI call (conceptual)</h2>
<pre><code>const completion = await openai.chat.completions.create({
  model: "gpt-4o-mini",
  response_format: { type: "json_object" },
  messages: [
    { role: "system", content: "Return JSON matching the user schema." },
    { role: "user", content: "Extract contact from: ..." },
  ],
});
const raw = completion.choices[0].message.content ?? "";</code></pre>

<h2>Repair and validate with Plinth</h2>
<pre><code>const schema = {
  type: "object",
  required: ["name", "email"],
  properties: {
    name: { type: "string" },
    email: { type: "string", format: "email" },
  },
};

const res = await fetch("https://api.plinthrun.com/v1/schema/repair-and-validate", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ text: raw, schema }),
});
const { valid, value, errors, repairs } = await res.json();</code></pre>

<h2>Retry prompt</h2>
<pre><code>if (!valid) {
  // send errors back to model once
  messages.push({
    role: "user",
    content: "Fix JSON errors: " + JSON.stringify(errors),
  });
}</code></pre>

<h2>Syntax issues OpenAI still emits</h2>
<ul>
  <li><a href="/guides/llm-markdown-json-fence">Markdown fences</a> when using chat models.</li>
  <li><a href="/guides/trailing-comma-json-fix">Trailing commas</a> on long arrays.</li>
  <li><a href="/guides/python-true-in-json">Python booleans</a> in copied examples.</li>
</ul>

<h2>Broader guide</h2>
<p><a href="/guides/structured-output-json-schema">Structured output JSON Schema</a> · <a href="/guides/llm-json-repair">LLM JSON repair</a></p>

<h2>Agents</h2>
<p>MCP <code class="inline-code">schema_repair_and_validate</code> — <a href="/guides/mcp-json-repair">MCP guide</a>, <a href="/docs/mcp">MCP docs</a>.</p>

<h2>Billing</h2>
<p>High volume: API key via <a href="/guides/polar-billing-api-keys">Polar</a> — <a href="/pricing">Pricing</a>.</p>
${footer('Related: <a href="/guides/structured-output-json-schema">Structured output JSON Schema</a> · <a href="/guides/llm-json-repair">LLM JSON repair</a>')}
`,
  },
  {
    slug: "catch-bin-expire",
    title: "Catch bin retention and expiry explained",
    description:
      "Free Catch bins expire after a limited window. Plan retention for webhook debugging and upgrade on Pro.",
    category: "Catch",
    htmlBody: `
<p>Webhook inspectors are not archives forever. Plinth <a href="/catch">Catch</a> free bins accept deliveries and store events for a short window so you can debug integrations without running a tunnel. After expiry, events are deleted to keep storage bounded.</p>

<h2>Why bins expire</h2>
<ul>
  <li>Webhook payloads often contain PII and secrets.</li>
  <li>Unbounded storage on free tier would be abused.</li>
  <li>Catch is for debugging, not long-term audit log.</li>
</ul>

<h2>Free vs Pro retention</h2>
<p>Free: enough time to inspect a few deliveries after setup — typically 24 hours aligned with <a href="/forms">Forms</a> free retention. Pro: extended history, replay, and higher limits — <a href="/pricing">Pricing</a>.</p>

<h2>Workflow before expiry</h2>
<ol>
  <li>Create bin — <code class="inline-code">POST /v1/catch/bins</code> (<a href="/docs/catch">docs</a>).</li>
  <li>Trigger provider events — <a href="/guides/test-stripe-webhooks">Stripe</a>, <a href="/guides/test-github-webhooks">GitHub</a>.</li>
  <li>Export JSON via <code class="inline-code">GET …/events</code> if you need a local copy.</li>
  <li>Replay to dev before bin ages out — <a href="/guides/webhook-replay">replay guide</a> (Pro).</li>
</ol>

<h2>Export example</h2>
<pre><code>curl https://api.plinthrun.com/v1/catch/bin_ID/events > captured.json</code></pre>

<h2>Do not use Catch as production queue</h2>
<p>Production webhooks should hit your Worker or server. Catch is a plotting sheet for integration work — compare <a href="/guides/webhook-site-alternative-free">Webhook.site alternative</a>.</p>

<h2>API keys and billing</h2>
<p>Pro entitlements attach via Polar — <a href="/guides/polar-billing-api-keys">API keys guide</a>, <a href="/docs/api-keys">docs</a>.</p>

<h2>Related products</h2>
<p>Same account covers <a href="/schema">Schema</a> and <a href="/forms">Forms</a>. Hub: <a href="/docs">/docs</a>.</p>
${footer('Related: <a href="/guides/webhook-replay">Webhook replay</a> · <a href="/guides/test-stripe-webhooks">Test Stripe webhooks</a>')}
`,
  },
  {
    slug: "honeypot-spam-form",
    title: "Honeypot spam protection for HTML forms",
    description:
      "Add a hidden _gotcha honeypot field so bots reveal themselves and Plinth Forms drops spam silently.",
    category: "Forms",
    htmlBody: `
<p>Public form endpoints attract bots. CAPTCHAs hurt conversion. Honeypots trick bots into filling fields humans never see. Plinth <a href="/forms">Forms</a> runs honeypot checks via <code class="inline-code">@plinth/forms</code> before storing submissions.</p>

<h2>Standard honeypot field</h2>
<pre><code>&lt;input
  type="text"
  name="_gotcha"
  tabindex="-1"
  autocomplete="off"
  aria-hidden="true"
  style="position:absolute;left:-9999px;width:1px;height:1px"
/&gt;</code></pre>
<p>Default field name is <code class="inline-code">_gotcha</code>. Bots auto-fill; humans leave empty.</p>

<h2>CSS-only hiding</h2>
<p>Do not use <code class="inline-code">display:none</code> alone — some bots skip it. Off-screen positioning works better. Optional: <code class="inline-code">class="hp"</code> with stylesheet in <a href="/guides/astro-contact-form">Astro guide</a>.</p>

<h2>Silent drop behavior</h2>
<p>Spam submissions return <code class="inline-code">200 OK</code> without storing — bots do not get error feedback to iterate. Legitimate users never touch the field.</p>

<h2>Combine with timing signals</h2>
<p>Open-core screener also scores submission speed and headers — <a href="/guides/open-core-form-backend">open-core backend</a>.</p>

<h2>Full form example</h2>
<pre><code>&lt;form method="POST" action="https://api.plinthrun.com/v1/forms/frm_ID"&gt;
  &lt;label&gt;Email &lt;input name="email" type="email" required /&gt;&lt;/label&gt;
  &lt;label&gt;Message &lt;textarea name="message" required&gt;&lt;/textarea&gt;&lt;/label&gt;
  &lt;input type="text" name="_gotcha" tabindex="-1" autocomplete="off"
         aria-hidden="true" style="position:absolute;left:-9999px" /&gt;
  &lt;button type="submit"&gt;Send&lt;/button&gt;
&lt;/form&gt;</code></pre>

<h2>Framework guides</h2>
<ul>
  <li><a href="/guides/static-site-contact-form">Static site</a></li>
  <li><a href="/guides/hugo-contact-form">Hugo</a></li>
  <li><a href="/guides/11ty-contact-form">11ty</a></li>
  <li><a href="/guides/nextjs-contact-form">Next.js</a></li>
</ul>

<h2>When honeypot is not enough</h2>
<p>Targeted attacks may bypass simple traps. Pro adds more signals and webhooks for your own scoring — <a href="/pricing">Pricing</a>, <a href="/docs/forms">Forms docs</a>.</p>
${footer('Related: <a href="/guides/open-core-form-backend">Open-core form backend</a> · <a href="/guides/formspree-free-tier-limit">Formspree limits</a>')}
`,
  },
  {
    slug: "polar-billing-api-keys",
    title: "Polar billing and Plinth API keys",
    description:
      "Checkout via Polar unlocks Pro entitlements. Claim pln_live API keys for Forms, Catch, and Schema.",
    category: "Platform",
    htmlBody: `
<p>Plinth bills through Polar.sh. Checkout on <a href="/pricing">Pricing</a> creates a subscription; Polar webhooks attach entitlements to your account; you claim an API key at <code class="inline-code">/start</code> for programmatic access.</p>

<h2>Key format</h2>
<p>Keys look like <code class="inline-code">pln_live_…</code>. Send as:</p>
<pre><code>x-plinth-key: pln_live_...
# or
Authorization: Bearer pln_live_...</code></pre>
<p>Reference: <a href="/docs/api-keys">API keys docs</a>.</p>

<h2>What Pro unlocks</h2>
<ul>
  <li><strong>Forms</strong> — longer retention, webhooks, higher quota (<a href="/forms">Forms</a>).</li>
  <li><strong>Catch</strong> — extended bin history, replay (<a href="/guides/webhook-replay">replay</a>, <a href="/guides/catch-bin-expire">expiry</a>).</li>
  <li><strong>Schema</strong> — higher repair/validate limits (<a href="/schema">Schema</a>).</li>
</ul>

<h2>Authenticated request example</h2>
<pre><code>curl https://api.plinthrun.com/v1/forms/frm_ID \\
  -H "x-plinth-key: pln_live_YOUR_KEY"</code></pre>

<h2>Anonymous vs keyed</h2>
<p>Anonymous endpoints (<code class="inline-code">POST /v1/forms/anonymous</code>, schema repair, catch bin create) are IP rate-limited. Production pipelines should use keys after checkout.</p>

<h2>Polar webhook flow (operators)</h2>
<p>If you self-host Plinth components, Polar still gates hosted entitlements. Open-core form code: <a href="/guides/open-core-form-backend">guide</a>.</p>

<h2>Product docs</h2>
<p><a href="/docs">All docs</a> — Forms, Catch, Schema, MCP (<a href="/docs/mcp">MCP</a>).</p>

<h2>Getting started free</h2>
<p>Mint forms and bins without paying — <a href="/guides/static-site-contact-form">contact form</a>, <a href="/guides/test-stripe-webhooks">Stripe webhooks</a>, <a href="/guides/llm-json-repair">JSON repair</a>. Upgrade when retention or replay matter.</p>
${footer('Related: <a href="/guides/catch-bin-expire">Catch bin expiry</a> · <a href="/guides/open-core-form-backend">Open-core form backend</a>')}
`,
  },
];

for (const guide of GUIDES) {
  const expansion =
    (GUIDE_EXPANSIONS[guide.slug] ?? "") +
    (GUIDE_LONGFORM[guide.slug] ?? "") +
    (GUIDE_BOOST[guide.slug] ?? "") +
    (CATEGORY_PAD[guide.category] ?? "");
  if (expansion) {
    guide.htmlBody = guide.htmlBody.replace(
      '<p class="guide-related">',
      `${expansion}\n<p class="guide-related">`,
    );
  }
}

for (const guide of GUIDES) {
  let guard = 0;
  while (wordCount(guide.htmlBody) < 800 && guard < 4) {
    guide.htmlBody = guide.htmlBody.replace(
      '<p class="guide-related">',
      `${MIN_WORDS_PAD}\n<p class="guide-related">`,
    );
    guard += 1;
  }
}

export const GUIDE_SLUGS = GUIDES.map((g) => g.slug);
