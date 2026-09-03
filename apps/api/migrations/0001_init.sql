-- Plinth core schema. Apply with: wrangler d1 migrations apply plinth

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  polar_customer_id TEXT UNIQUE,
  email TEXT NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS api_keys (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  prefix TEXT NOT NULL,
  hash TEXT NOT NULL UNIQUE,
  created_at INTEGER NOT NULL,
  revoked_at INTEGER,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS entitlements (
  user_id TEXT NOT NULL,
  product TEXT NOT NULL,
  plan TEXT NOT NULL,
  polar_subscription_id TEXT,
  polar_product_id TEXT,
  status TEXT NOT NULL,
  current_period_end INTEGER,
  PRIMARY KEY (user_id, product)
);

CREATE TABLE IF NOT EXISTS usage_day (
  key_id TEXT NOT NULL,
  product TEXT NOT NULL,
  day TEXT NOT NULL,
  count INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (key_id, product, day)
);

CREATE TABLE IF NOT EXISTS forms (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  name TEXT NOT NULL,
  notify_email TEXT,
  honeypot TEXT DEFAULT '_gotcha',
  redirect_url TEXT,
  webhook_url TEXT,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS form_submissions (
  id TEXT PRIMARY KEY,
  form_id TEXT NOT NULL,
  payload TEXT NOT NULL,
  ip_hash TEXT,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (form_id) REFERENCES forms(id)
);

CREATE TABLE IF NOT EXISTS catch_bins (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  name TEXT,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS catch_events (
  id TEXT PRIMARY KEY,
  bin_id TEXT NOT NULL,
  method TEXT NOT NULL,
  path TEXT,
  headers TEXT NOT NULL,
  body TEXT,
  json TEXT,
  size INTEGER,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (bin_id) REFERENCES catch_bins(id)
);

CREATE TABLE IF NOT EXISTS saved_schemas (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  schema_json TEXT NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS support_tickets (
  id TEXT PRIMARY KEY,
  from_email TEXT NOT NULL,
  subject TEXT,
  body TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS polar_events (
  id TEXT PRIMARY KEY,
  type TEXT,
  processed_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS claims (
  token TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  api_key_plain TEXT NOT NULL,
  checkout_id TEXT,
  created_at INTEGER NOT NULL,
  consumed_at INTEGER
);

CREATE INDEX IF NOT EXISTS idx_submissions_form ON form_submissions(form_id, created_at);
CREATE INDEX IF NOT EXISTS idx_events_bin ON catch_events(bin_id, created_at);
CREATE INDEX IF NOT EXISTS idx_keys_hash ON api_keys(hash);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
