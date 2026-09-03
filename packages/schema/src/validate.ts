export type SchemaError = {
  path: string;
  message: string;
};

export type ValidateResult = {
  valid: boolean;
  errors: SchemaError[];
};

type JsonSchema = {
  type?: string | string[];
  properties?: Record<string, JsonSchema>;
  required?: string[];
  additionalProperties?: boolean | JsonSchema;
  items?: JsonSchema | JsonSchema[];
  minItems?: number;
  maxItems?: number;
  enum?: unknown[];
  const?: unknown;
  minimum?: number;
  maximum?: number;
  exclusiveMinimum?: number | boolean;
  exclusiveMaximum?: number | boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  format?: string;
  anyOf?: JsonSchema[];
  oneOf?: JsonSchema[];
  allOf?: JsonSchema[];
  not?: JsonSchema;
  $ref?: string;
  definitions?: Record<string, JsonSchema>;
  $defs?: Record<string, JsonSchema>;
};

export function validateJson(value: unknown, schema: unknown): ValidateResult {
  const errors: SchemaError[] = [];
  if (!schema || typeof schema !== "object") {
    return { valid: false, errors: [{ path: "", message: "Schema must be an object" }] };
  }
  walk(value, schema as JsonSchema, "", errors, schema as JsonSchema);
  return { valid: errors.length === 0, errors };
}

function walk(
  value: unknown,
  schema: JsonSchema,
  path: string,
  errors: SchemaError[],
  root: JsonSchema,
): void {
  if (schema.$ref) {
    const resolved = resolveRef(schema.$ref, root);
    if (!resolved) {
      errors.push({ path, message: `Could not resolve $ref ${schema.$ref}` });
      return;
    }
    walk(value, resolved, path, errors, root);
    return;
  }

  if (schema.const !== undefined && !same(value, schema.const)) {
    errors.push({ path, message: `Expected const ${json(schema.const)}` });
  }

  if (schema.enum && !schema.enum.some((item) => same(item, value))) {
    errors.push({ path, message: `Expected one of ${schema.enum.map(json).join(", ")}` });
  }

  if (schema.type) {
    const types = Array.isArray(schema.type) ? schema.type : [schema.type];
    if (!types.some((t) => matchesType(value, t))) {
      errors.push({ path, message: `Expected type ${types.join("|")}, got ${typeName(value)}` });
      return;
    }
  }

  if (schema.allOf) for (const part of schema.allOf) walk(value, part, path, errors, root);

  if (schema.anyOf && !schema.anyOf.some((part) => validateJson(value, part).valid)) {
    errors.push({ path, message: "Did not match any anyOf branch" });
  }

  if (schema.oneOf) {
    const hits = schema.oneOf.filter((part) => validateJson(value, part).valid).length;
    if (hits !== 1) errors.push({ path, message: `Expected exactly one oneOf branch, matched ${hits}` });
  }

  if (schema.not && validateJson(value, schema.not).valid) {
    errors.push({ path, message: "Matched a not schema" });
  }

  if (typeof value === "string") {
    if (schema.minLength !== undefined && value.length < schema.minLength) {
      errors.push({ path, message: `Shorter than minLength ${schema.minLength}` });
    }
    if (schema.maxLength !== undefined && value.length > schema.maxLength) {
      errors.push({ path, message: `Longer than maxLength ${schema.maxLength}` });
    }
    if (schema.pattern) {
      try {
        if (!new RegExp(schema.pattern).test(value)) {
          errors.push({ path, message: `Did not match pattern ${schema.pattern}` });
        }
      } catch {
        errors.push({ path, message: "Schema pattern is not a valid regular expression" });
      }
    }
    if (schema.format && !checkFormat(value, schema.format)) {
      errors.push({ path, message: `Did not match format ${schema.format}` });
    }
  }

  if (typeof value === "number") {
    if (schema.minimum !== undefined && value < schema.minimum) {
      errors.push({ path, message: `Below minimum ${schema.minimum}` });
    }
    if (schema.maximum !== undefined && value > schema.maximum) {
      errors.push({ path, message: `Above maximum ${schema.maximum}` });
    }
    if (typeof schema.exclusiveMinimum === "number" && value <= schema.exclusiveMinimum) {
      errors.push({ path, message: `Not above exclusiveMinimum ${schema.exclusiveMinimum}` });
    }
    if (typeof schema.exclusiveMaximum === "number" && value >= schema.exclusiveMaximum) {
      errors.push({ path, message: `Not below exclusiveMaximum ${schema.exclusiveMaximum}` });
    }
  }

  if (Array.isArray(value)) {
    if (schema.minItems !== undefined && value.length < schema.minItems) {
      errors.push({ path, message: `Fewer than minItems ${schema.minItems}` });
    }
    if (schema.maxItems !== undefined && value.length > schema.maxItems) {
      errors.push({ path, message: `More than maxItems ${schema.maxItems}` });
    }
    if (schema.items) {
      if (Array.isArray(schema.items)) {
        schema.items.forEach((itemSchema, idx) => {
          if (idx < value.length) walk(value[idx], itemSchema, join(path, String(idx)), errors, root);
        });
      } else {
        value.forEach((item, idx) => walk(item, schema.items as JsonSchema, join(path, String(idx)), errors, root));
      }
    }
  }

  if (value && typeof value === "object" && !Array.isArray(value)) {
    const obj = value as Record<string, unknown>;
    for (const key of schema.required ?? []) {
      if (!(key in obj)) errors.push({ path: join(path, key), message: "Missing required property" });
    }
    const props = schema.properties ?? {};
    for (const [key, child] of Object.entries(obj)) {
      if (props[key]) walk(child, props[key], join(path, key), errors, root);
      else if (schema.additionalProperties === false) {
        errors.push({ path: join(path, key), message: "Additional property not allowed" });
      } else if (schema.additionalProperties && typeof schema.additionalProperties === "object") {
        walk(child, schema.additionalProperties, join(path, key), errors, root);
      }
    }
  }
}

function resolveRef(ref: string, root: JsonSchema): JsonSchema | undefined {
  if (!ref.startsWith("#/")) return undefined;
  const parts = ref.slice(2).split("/");
  let cur: unknown = root;
  for (const part of parts) {
    if (!cur || typeof cur !== "object") return undefined;
    cur = (cur as Record<string, unknown>)[part];
  }
  return cur && typeof cur === "object" ? (cur as JsonSchema) : undefined;
}

function matchesType(value: unknown, type: string): boolean {
  switch (type) {
    case "object":
      return !!value && typeof value === "object" && !Array.isArray(value);
    case "array":
      return Array.isArray(value);
    case "string":
      return typeof value === "string";
    case "number":
      return typeof value === "number" && !Number.isNaN(value);
    case "integer":
      return typeof value === "number" && Number.isInteger(value);
    case "boolean":
      return typeof value === "boolean";
    case "null":
      return value === null;
    default:
      return true;
  }
}

function typeName(value: unknown): string {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value;
}

function same(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

function json(value: unknown): string {
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function join(base: string, key: string): string {
  return base ? `${base}.${key}` : key;
}

function checkFormat(value: string, format: string): boolean {
  switch (format) {
    case "email":
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    case "uri":
    case "url":
      try {
        const u = new URL(value);
        return u.protocol === "http:" || u.protocol === "https:";
      } catch {
        return false;
      }
    case "uuid":
      return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
    case "date-time":
      return !Number.isNaN(Date.parse(value));
    case "date":
      return /^\d{4}-\d{2}-\d{2}$/.test(value);
    default:
      return true;
  }
}
