import { describe, expect, it } from "vitest";
import { repairAndValidate, repairJson, validateJson } from "./index.ts";

describe("repairJson", () => {
  it("parses valid JSON unchanged", () => {
    const r = repairJson('{"ok": true}');
    expect(r.ok).toBe(true);
    expect(r.value).toEqual({ ok: true });
    expect(r.repairs).toEqual([]);
  });

  it("strips markdown fences and python literals", () => {
    const r = repairJson("```json\n{name: 'Ada', ok: True, n: None,}\n```");
    expect(r.ok).toBe(true);
    expect(r.value).toEqual({ name: "Ada", ok: true, n: null });
  });

  it("closes truncated objects from LLM output", () => {
    const r = repairJson('{"title": "hi", "items": [1, 2');
    expect(r.ok).toBe(true);
    expect(r.value).toEqual({ title: "hi", items: [1, 2] });
  });

  it("drops leading prose", () => {
    const r = repairJson("Sure, here you go:\n{\"a\": 1}");
    expect(r.ok).toBe(true);
    expect(r.value).toEqual({ a: 1 });
  });
});

describe("validateJson", () => {
  const schema = {
    type: "object",
    required: ["email"],
    properties: {
      email: { type: "string", format: "email" },
      age: { type: "integer", minimum: 0 },
    },
    additionalProperties: false,
  };

  it("accepts a matching object", () => {
    expect(validateJson({ email: "a@b.com", age: 2 }, schema).valid).toBe(true);
  });

  it("rejects missing required and extra keys", () => {
    const r = validateJson({ extra: true }, schema);
    expect(r.valid).toBe(false);
    expect(r.errors.some((e) => e.message.includes("required"))).toBe(true);
  });
});

describe("repairAndValidate", () => {
  it("repairs then validates", () => {
    const r = repairAndValidate("{email: 'not-an-email'}", {
      type: "object",
      required: ["email"],
      properties: { email: { type: "string", format: "email" } },
    });
    expect(r.ok).toBe(true);
    expect(r.valid).toBe(false);
    expect(r.schemaErrors.length).toBeGreaterThan(0);
  });
});
