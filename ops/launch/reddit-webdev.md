# r/webdev — Plinth Forms

## Title

Open-core Formspree alternative: POST URL for static sites, no server required

## Body

I built [Plinth Forms](https://plinthrun.com/forms) as part of a small dev-tools portfolio. It gives you a form `action` URL for static sites (Astro, Hugo, 11ty, plain HTML) without running your own backend.

**What it does:**
- Create a form endpoint (anonymous, no account needed for the first one)
- Paste the HTML snippet into your site
- Submissions are stored; honeypot spam screening is built in
- Pro ($19/mo) adds webhooks, longer retention, higher quota, private forms

**Open-core:** The screener and storage logic are in `@plinth/forms` on npm. You can self-host the Worker or use the hosted API at `https://api.plinthrun.com`.

**Free tier:** 50 submissions/month, 1 form, no signup required to get started.

Same company also ships Catch (webhook inbox, Webhook.site-style) and Schema (JSON repair for LLM output), but Forms is the piece most relevant here.

Docs: https://plinthrun.com/docs/forms  
Comparison vs Formspree: https://plinthrun.com/compare/formspree  
Source: https://github.com/soulpool90-png/plinth

Feedback welcome — especially on what would make you switch from Formspree or Netlify Forms.
