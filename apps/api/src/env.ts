export type Env = {
  DB: D1Database;
  PUBLIC_WEB_URL: string;
  API_PUBLIC_URL: string;
  POLAR_ACCESS_TOKEN?: string;
  POLAR_WEBHOOK_SECRET?: string;
  POLAR_PRODUCT_FORMS_PRO?: string;
  POLAR_PRODUCT_FORMS_TEAM?: string;
  POLAR_PRODUCT_CATCH_PRO?: string;
  POLAR_PRODUCT_CATCH_TEAM?: string;
  POLAR_PRODUCT_SCHEMA_PRO?: string;
  POLAR_PRODUCT_SCHEMA_TEAM?: string;
  RESEND_API_KEY?: string;
  FROM_EMAIL?: string;
  REPORT_EMAIL?: string;
};

export type AuthContext = {
  userId: string | null;
  keyId: string;
  plan: "free" | "pro" | "team";
  email?: string;
};
