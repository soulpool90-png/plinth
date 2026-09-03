# Checkout proof (human, ~5 min)

All six `POST /v1/checkout` pairs already return live Polar URLs (verified 2026-09-03).

## Your part

1. In Polar → Discounts, create a **100% off** code named `PLINTHTEST` (one-time or limited uses).
2. Open this URL (or click Schema Pro on /pricing and apply the code at Polar checkout):

```
POST https://api.plinthrun.com/v1/checkout
{"product":"schema","plan":"pro","discount_code":"PLINTHTEST"}
```

Or from the browser console on https://plinthrun.com/pricing:

```js
fetch("https://api.plinthrun.com/v1/checkout", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ product: "schema", plan: "pro", discount_code: "PLINTHTEST" }),
}).then((r) => r.json()).then((d) => (location.href = d.url));
```

3. Complete checkout (should be $0 with the code).
4. On `/start`, click **Claim key**. Copy the key.
5. On `/account`, paste the key → **Load entitlements**. You should see `schema` / `pro` / `active`.
6. Click **Manage billing** to confirm the Polar portal opens.
7. Delete or disable `PLINTHTEST` in Polar.

Reply in chat with "checkout proof ok" or paste any error JSON.
