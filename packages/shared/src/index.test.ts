import { describe, expect, it } from "vitest";
import { LIMITS, isProduct } from "./index.ts";

describe("shared", () => {
  it("exposes free form quota", () => {
    expect(LIMITS.free.forms.monthlyQuota).toBeGreaterThan(0);
    expect(isProduct("schema")).toBe(true);
  });
});
