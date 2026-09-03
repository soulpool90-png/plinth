export const PRODUCTS = ["forms", "catch", "schema"] as const;
export type Product = (typeof PRODUCTS)[number];
export type Plan = "free" | "pro" | "team";

export const PRICES = {
  pro: { monthly: 1900, annual: 19000, label: "$19" },
  team: { monthly: 4900, annual: 49000, label: "$49" },
} as const;

export type ProductLimits = {
  monthlyQuota: number;
  dailyQuota: number;
  resources: number;
  retentionDays: number;
  webhooks: boolean;
  replay: boolean;
  private: boolean;
};

export const LIMITS: Record<Plan, Record<Product, ProductLimits>> = {
  free: {
    forms: {
      monthlyQuota: 50,
      dailyQuota: 20,
      resources: 1,
      retentionDays: 7,
      webhooks: false,
      replay: false,
      private: false,
    },
    catch: {
      monthlyQuota: 50,
      dailyQuota: 50,
      resources: 1,
      retentionDays: 1,
      webhooks: false,
      replay: false,
      private: false,
    },
    schema: {
      monthlyQuota: 3000,
      dailyQuota: 100,
      resources: 0,
      retentionDays: 0,
      webhooks: false,
      replay: false,
      private: false,
    },
  },
  pro: {
    forms: {
      monthlyQuota: 2000,
      dailyQuota: 400,
      resources: 20,
      retentionDays: 365,
      webhooks: true,
      replay: false,
      private: true,
    },
    catch: {
      monthlyQuota: 10000,
      dailyQuota: 2000,
      resources: 20,
      retentionDays: 30,
      webhooks: true,
      replay: true,
      private: true,
    },
    schema: {
      monthlyQuota: 300000,
      dailyQuota: 10000,
      resources: 50,
      retentionDays: 30,
      webhooks: true,
      replay: false,
      private: true,
    },
  },
  team: {
    forms: {
      monthlyQuota: 20000,
      dailyQuota: 4000,
      resources: 200,
      retentionDays: 365,
      webhooks: true,
      replay: false,
      private: true,
    },
    catch: {
      monthlyQuota: 100000,
      dailyQuota: 20000,
      resources: 100,
      retentionDays: 90,
      webhooks: true,
      replay: true,
      private: true,
    },
    schema: {
      monthlyQuota: 3000000,
      dailyQuota: 100000,
      resources: 500,
      retentionDays: 90,
      webhooks: true,
      replay: false,
      private: true,
    },
  },
};

export const PRODUCT_COPY: Record<
  Product,
  { name: string; pitch: string; href: string }
> = {
  forms: {
    name: "Forms",
    pitch: "A POST URL for any static site. Spam screens, stores, optionally forwards.",
    href: "/forms",
  },
  catch: {
    name: "Catch",
    pitch: "A URL that records every HTTP request. Inspect, share, replay.",
    href: "/catch",
  },
  schema: {
    name: "Schema",
    pitch: "Repair broken JSON, then prove it against a schema. Built for LLM output.",
    href: "/schema",
  },
};

export function isProduct(value: string): value is Product {
  return (PRODUCTS as readonly string[]).includes(value);
}

export function isPlan(value: string): value is Plan {
  return value === "free" || value === "pro" || value === "team";
}
