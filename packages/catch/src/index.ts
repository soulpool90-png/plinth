export type HeaderMap = Record<string, string>;

export type RequestSnapshot = {
  method: string;
  path: string;
  query: Record<string, string>;
  headers: HeaderMap;
  body: string;
  json: unknown | null;
  size: number;
  contentType: string | null;
};

const REDACT = /^(authorization|cookie|set-cookie|x-api-key|proxy-authorization)$/i;

export function redactHeaders(headers: HeaderMap, extra: string[] = []): HeaderMap {
  const extraSet = new Set(extra.map((h) => h.toLowerCase()));
  const out: HeaderMap = {};
  for (const [key, value] of Object.entries(headers)) {
    out[key] = REDACT.test(key) || extraSet.has(key.toLowerCase()) ? "[redacted]" : value;
  }
  return out;
}

export function snapshotFromParts(input: {
  method: string;
  url: string;
  headers: HeaderMap;
  body: string;
  redact?: boolean;
}): RequestSnapshot {
  const url = new URL(input.url, "https://plinth.local");
  const query: Record<string, string> = {};
  url.searchParams.forEach((v, k) => {
    query[k] = v;
  });
  const headers = input.redact === false ? input.headers : redactHeaders(input.headers);
  const contentType = header(input.headers, "content-type");
  let json: unknown | null = null;
  if ((contentType ?? "").includes("json") || looksJson(input.body)) {
    try {
      json = JSON.parse(input.body);
    } catch {
      json = null;
    }
  }
  return {
    method: input.method.toUpperCase(),
    path: url.pathname,
    query,
    headers,
    body: input.body,
    json,
    size: new TextEncoder().encode(input.body).length,
    contentType,
  };
}

function header(headers: HeaderMap, name: string): string | null {
  const found = Object.entries(headers).find(([k]) => k.toLowerCase() === name.toLowerCase());
  return found ? found[1] : null;
}

function looksJson(body: string): boolean {
  const t = body.trim();
  return (t.startsWith("{") && t.endsWith("}")) || (t.startsWith("[") && t.endsWith("]"));
}
