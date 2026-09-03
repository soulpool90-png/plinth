import { describe, expect, it } from "vitest";
import { redactHeaders, snapshotFromParts } from "./index.ts";

describe("redactHeaders", () => {
  it("redacts authorization", () => {
    expect(redactHeaders({ Authorization: "Bearer secret", Accept: "application/json" })).toEqual({
      Authorization: "[redacted]",
      Accept: "application/json",
    });
  });
});

describe("snapshotFromParts", () => {
  it("parses json bodies and query", () => {
    const snap = snapshotFromParts({
      method: "post",
      url: "https://api.example/hooks/abc?mode=test",
      headers: { "content-type": "application/json", authorization: "s" },
      body: '{"ok":true}',
    });
    expect(snap.method).toBe("POST");
    expect(snap.query.mode).toBe("test");
    expect(snap.json).toEqual({ ok: true });
    expect(snap.headers.authorization).toBe("[redacted]");
  });
});
