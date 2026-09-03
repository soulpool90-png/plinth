import { describe, expect, it } from "vitest";
import { dayKey, sha256 } from "./util.ts";

describe("util", () => {
  it("hashes and formats day keys", async () => {
    expect(dayKey(Date.UTC(2026, 0, 2))).toBe("2026-01-02");
    expect(await sha256("plinth")).toHaveLength(64);
  });
});
