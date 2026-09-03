import { describe, expect, it } from "vitest";
import { parseFormBody, screenSubmission, snippet } from "./index.ts";

describe("parseFormBody", () => {
  it("parses urlencoded bodies", () => {
    const fields = parseFormBody(
      "application/x-www-form-urlencoded",
      "name=Ada&email=ada%40example.com",
    );
    expect(fields).toEqual({ name: "Ada", email: "ada@example.com" });
  });
});

describe("screenSubmission", () => {
  it("flags honeypots and lets clean mail through", () => {
    expect(
      screenSubmission({ fields: { name: "Ada", email: "a@b.com", _gotcha: "bot" } }).ok,
    ).toBe(false);
    expect(screenSubmission({ fields: { name: "Ada", email: "a@b.com" } }).ok).toBe(true);
  });
});

describe("snippet", () => {
  it("includes the action URL", () => {
    expect(snippet({ action: "https://api.plinth.dev/v1/forms/abc" })).toContain(
      "https://api.plinth.dev/v1/forms/abc",
    );
  });
});
