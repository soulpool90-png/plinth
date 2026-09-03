import type { Env, AuthContext } from "./env.ts";
import { dayKey, id, monthKey, sha256 } from "./util.ts";
import { LIMITS, type Plan, type Product } from "@plinth/shared";

export async function resolveAuth(env: Env, request: Request, product: Product): Promise<AuthContext> {
  const raw =
    request.headers.get("x-plinth-key") ||
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ||
    "";

  if (!raw) {
    const ip = request.headers.get("cf-connecting-ip") || "anon";
    return { userId: null, keyId: `anon_${await sha256(ip)}`, plan: "free" };
  }

  const hash = await sha256(raw);
  const row = await env.DB.prepare(
    `SELECT k.id as key_id, k.user_id, u.email, e.plan, e.status
     FROM api_keys k
     JOIN users u ON u.id = k.user_id
     LEFT JOIN entitlements e ON e.user_id = k.user_id AND e.product = ?
     WHERE k.hash = ? AND k.revoked_at IS NULL
     LIMIT 1`,
  )
    .bind(product, hash)
    .first<{ key_id: string; user_id: string; email: string; plan: string | null; status: string | null }>();

  if (!row) {
    const err = new Error("Invalid API key");
    (err as Error & { status: number }).status = 401;
    throw err;
  }

  const plan: Plan =
    row.status === "active" && (row.plan === "pro" || row.plan === "team") ? row.plan : "free";

  return { userId: row.user_id, keyId: row.key_id, plan, email: row.email };
}

export async function consumeQuota(
  env: Env,
  auth: AuthContext,
  product: Product,
  amount = 1,
): Promise<{ ok: boolean; remaining: number; limit: number }> {
  const limits = LIMITS[auth.plan][product];
  const day = dayKey();
  const month = monthKey();

  await env.DB.prepare(
    `INSERT INTO usage_day (key_id, product, day, count) VALUES (?, ?, ?, 0)
     ON CONFLICT(key_id, product, day) DO NOTHING`,
  )
    .bind(auth.keyId, product, day)
    .run();

  await env.DB.prepare(
    `INSERT INTO usage_day (key_id, product, day, count) VALUES (?, ?, ?, 0)
     ON CONFLICT(key_id, product, day) DO NOTHING`,
  )
    .bind(auth.keyId, product, `m:${month}`)
    .run();

  const daily = await env.DB.prepare(
    `SELECT count FROM usage_day WHERE key_id = ? AND product = ? AND day = ?`,
  )
    .bind(auth.keyId, product, day)
    .first<{ count: number }>();

  const monthly = await env.DB.prepare(
    `SELECT count FROM usage_day WHERE key_id = ? AND product = ? AND day = ?`,
  )
    .bind(auth.keyId, product, `m:${month}`)
    .first<{ count: number }>();

  const dayCount = daily?.count ?? 0;
  const monthCount = monthly?.count ?? 0;
  if (dayCount + amount > limits.dailyQuota || monthCount + amount > limits.monthlyQuota) {
    return {
      ok: false,
      remaining: Math.max(0, Math.min(limits.dailyQuota - dayCount, limits.monthlyQuota - monthCount)),
      limit: Math.min(limits.dailyQuota, limits.monthlyQuota),
    };
  }

  await env.DB.prepare(
    `UPDATE usage_day SET count = count + ? WHERE key_id = ? AND product = ? AND day = ?`,
  )
    .bind(amount, auth.keyId, product, day)
    .run();
  await env.DB.prepare(
    `UPDATE usage_day SET count = count + ? WHERE key_id = ? AND product = ? AND day = ?`,
  )
    .bind(amount, auth.keyId, product, `m:${month}`)
    .run();

  return {
    ok: true,
    remaining: Math.min(limits.dailyQuota - dayCount - amount, limits.monthlyQuota - monthCount - amount),
    limit: Math.min(limits.dailyQuota, limits.monthlyQuota),
  };
}

export async function mintApiKey(env: Env, userId: string): Promise<{ id: string; key: string; prefix: string }> {
  const secret = id("").slice(0, 32);
  const key = `pln_live_${secret}`;
  const prefix = key.slice(0, 16);
  const keyId = id("key");
  await env.DB.prepare(
    `INSERT INTO api_keys (id, user_id, prefix, hash, created_at) VALUES (?, ?, ?, ?, ?)`,
  )
    .bind(keyId, userId, prefix, await sha256(key), Date.now())
    .run();
  return { id: keyId, key, prefix };
}

export async function ensureUser(
  env: Env,
  email: string,
  polarCustomerId?: string | null,
): Promise<string> {
  const existing = await env.DB.prepare(`SELECT id FROM users WHERE email = ? LIMIT 1`)
    .bind(email.toLowerCase())
    .first<{ id: string }>();
  if (existing) {
    if (polarCustomerId) {
      await env.DB.prepare(`UPDATE users SET polar_customer_id = COALESCE(polar_customer_id, ?) WHERE id = ?`)
        .bind(polarCustomerId, existing.id)
        .run();
    }
    return existing.id;
  }
  const userId = id("usr");
  await env.DB.prepare(
    `INSERT INTO users (id, polar_customer_id, email, created_at) VALUES (?, ?, ?, ?)`,
  )
    .bind(userId, polarCustomerId ?? null, email.toLowerCase(), Date.now())
    .run();
  return userId;
}
