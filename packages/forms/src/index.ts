export type FormFields = Record<string, string | string[]>;

export type ScreenInput = {
  fields: FormFields;
  honeypot?: string;
  receivedAt?: number;
  startedAt?: number;
  ip?: string;
  userAgent?: string;
};

export type ScreenResult = {
  ok: boolean;
  reasons: string[];
  payload: FormFields;
};

const HONEYPOT_DEFAULTS = ["_gotcha", "website", "company_url", "fax"];
const URL_RE = /https?:\/\/|www\./i;

export function parseFormBody(contentType: string | null, raw: string): FormFields {
  const type = (contentType ?? "").toLowerCase();
  if (type.includes("application/json")) {
    try {
      const data = JSON.parse(raw) as unknown;
      if (data && typeof data === "object" && !Array.isArray(data)) {
        const out: FormFields = {};
        for (const [k, v] of Object.entries(data as Record<string, unknown>)) {
          out[k] = Array.isArray(v) ? v.map(String) : String(v ?? "");
        }
        return out;
      }
    } catch {
      return { _raw: raw };
    }
  }
  if (type.includes("application/x-www-form-urlencoded") || !type) {
    const params = new URLSearchParams(raw);
    const out: FormFields = {};
    for (const [k, v] of params.entries()) {
      if (k in out) {
        const prev = out[k];
        out[k] = Array.isArray(prev) ? [...prev, v] : [prev, v];
      } else out[k] = v;
    }
    return out;
  }
  return { _raw: raw };
}

export function screenSubmission(input: ScreenInput): ScreenResult {
  const reasons: string[] = [];
  const fields = { ...input.fields };
  const honeypotKeys = input.honeypot ? [input.honeypot, ...HONEYPOT_DEFAULTS] : HONEYPOT_DEFAULTS;

  for (const key of honeypotKeys) {
    const val = fields[key];
    if (val && String(val).trim()) {
      reasons.push(`honeypot:${key}`);
    }
    delete fields[key];
  }

  const values = Object.values(fields).flatMap((v) => (Array.isArray(v) ? v : [v]));
  const filled = values.filter((v) => String(v).trim().length > 0);
  if (filled.length === 0) reasons.push("empty");

  const linkHits = values.filter((v) => URL_RE.test(String(v))).length;
  if (linkHits >= 4) reasons.push("link-flood");

  if (input.startedAt && input.receivedAt && input.receivedAt - input.startedAt < 800) {
    reasons.push("too-fast");
  }

  const blob = values.join(" ").toLowerCase();
  if (/(viagra|crypto\s*alert|seo\s*backlink|onlyfans)/i.test(blob)) {
    reasons.push("keyword");
  }

  return { ok: reasons.length === 0, reasons, payload: fields };
}

export function snippet(opts: { action: string; honeypot?: string }): string {
  const hp = opts.honeypot ?? "_gotcha";
  return `<form action="${opts.action}" method="POST">
  <label>Name <input name="name" required></label>
  <label>Email <input name="email" type="email" required></label>
  <label>Message <textarea name="message" required></textarea></label>
  <input type="text" name="${hp}" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px">
  <button type="submit">Send</button>
</form>`;
}
