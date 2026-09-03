export function id(prefix = ""): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  const hex = [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
  return prefix ? `${prefix}_${hex}` : hex;
}

export async function sha256(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function now(): number {
  return Date.now();
}

export function dayKey(ts = Date.now()): string {
  return new Date(ts).toISOString().slice(0, 10);
}

export function monthKey(ts = Date.now()): string {
  return new Date(ts).toISOString().slice(0, 7);
}

export function json(data: unknown, status = 200, headers: HeadersInit = {}): Response {
  return Response.json(data, {
    status,
    headers: {
      "cache-control": "no-store",
      ...headers,
    },
  });
}

export function corsHeaders(origin: string | null, webUrl: string): HeadersInit {
  const allow = origin && (origin === webUrl || origin.endsWith(".pages.dev") || origin.includes("localhost"))
    ? origin
    : webUrl;
  return {
    "access-control-allow-origin": allow,
    "access-control-allow-headers": "authorization, content-type, x-plinth-key",
    "access-control-allow-methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
    "access-control-max-age": "86400",
  };
}
