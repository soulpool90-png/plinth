export type Repair = { type: string; detail: string };

export type RepairResult = {
  ok: boolean;
  text: string;
  value: unknown;
  repairs: Repair[];
  error?: string;
};

const PYTHON: Record<string, string> = {
  True: "true",
  False: "false",
  None: "null",
};

export function extractPayload(input: string): { text: string; repairs: Repair[] } {
  const repairs: Repair[] = [];
  let text = input.replace(/^\uFEFF/, "").trim();

  const fence = text.match(/```(?:json|javascript|js|ts)?\s*([\s\S]*?)```/i);
  if (fence) {
    text = fence[1].trim();
    repairs.push({ type: "markdown-fence", detail: "Stripped fenced code block" });
  } else {
    const firstObj = text.indexOf("{");
    const firstArr = text.indexOf("[");
    const start = [firstObj, firstArr].filter((i) => i >= 0).sort((a, b) => a - b)[0];
    if (start !== undefined && start > 0) {
      text = text.slice(start);
      repairs.push({ type: "leading-prose", detail: "Dropped text before first { or [" });
    }
  }

  return { text, repairs };
}

export function repairJson(input: string): RepairResult {
  const repairs: Repair[] = [];
  if (typeof input !== "string") {
    return { ok: false, text: "", value: undefined, repairs, error: "Input must be a string" };
  }

  const extracted = extractPayload(input);
  repairs.push(...extracted.repairs);
  let text = extracted.text;

  if (!text) {
    return { ok: false, text, value: undefined, repairs, error: "Empty input" };
  }

  const direct = tryParse(text);
  if (direct.ok) return { ok: true, text, value: direct.value, repairs };

  const py = text.replace(/\b(True|False|None)\b/g, (m) => {
    repairs.push({ type: "python-literal", detail: `${m} → ${PYTHON[m]}` });
    return PYTHON[m];
  });
  if (py !== text) {
    text = py;
    const parsed = tryParse(text);
    if (parsed.ok) return { ok: true, text, value: parsed.value, repairs };
  }

  const strippedComments = stripComments(text);
  if (strippedComments !== text) {
    repairs.push({ type: "comments", detail: "Removed // and /* */ comments" });
    text = strippedComments;
    const parsed = tryParse(text);
    if (parsed.ok) return { ok: true, text, value: parsed.value, repairs };
  }

  const rebuilt = rebuild(text, repairs);
  const parsed = tryParse(rebuilt);
  if (parsed.ok) return { ok: true, text: rebuilt, value: parsed.value, repairs };

  return {
    ok: false,
    text: rebuilt,
    value: undefined,
    repairs,
    error: parsed.error ?? "Could not repair into valid JSON",
  };
}

function tryParse(text: string): { ok: true; value: unknown } | { ok: false; error: string } {
  try {
    return { ok: true, value: JSON.parse(text) };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

function stripComments(src: string): string {
  let out = "";
  let i = 0;
  let inStr: string | null = null;
  let escape = false;
  while (i < src.length) {
    const c = src[i];
    if (inStr) {
      out += c;
      if (escape) escape = false;
      else if (c === "\\") escape = true;
      else if (c === inStr) inStr = null;
      i++;
      continue;
    }
    if (c === "\"" || c === "'") {
      inStr = c;
      out += c;
      i++;
      continue;
    }
    if (c === "/" && src[i + 1] === "/") {
      while (i < src.length && src[i] !== "\n") i++;
      continue;
    }
    if (c === "/" && src[i + 1] === "*") {
      i += 2;
      while (i < src.length && !(src[i] === "*" && src[i + 1] === "/")) i++;
      i += 2;
      continue;
    }
    out += c;
    i++;
  }
  return out;
}

function rebuild(src: string, repairs: Repair[]): string {
  let i = 0;
  const stack: Array<"obj" | "arr"> = [];
  let out = "";
  let expectKey = false;
  let afterColon = false;
  let needComma = false;

  const peek = () => src[i];
  const skipWs = () => {
    while (i < src.length && /\s/.test(src[i])) {
      out += src[i];
      i++;
    }
  };

  const pushCommaIfNeeded = () => {
    if (needComma) {
      out += ",";
      repairs.push({ type: "inserted-comma", detail: "Inserted missing comma" });
      needComma = false;
    }
  };

  while (i < src.length) {
    skipWs();
    if (i >= src.length) break;
    const c = peek();

    if (c === "}" || c === "]") {
      needComma = false;
      const want = c === "}" ? "obj" : "arr";
      if (stack.length && stack[stack.length - 1] === want) stack.pop();
      else repairs.push({ type: "unmatched-close", detail: `Unexpected ${c}` });
      out += c;
      i++;
      needComma = true;
      expectKey = stack[stack.length - 1] === "obj";
      afterColon = false;
      continue;
    }

    if (c === ",") {
      out += ",";
      i++;
      needComma = false;
      afterColon = false;
      expectKey = stack[stack.length - 1] === "obj";
      skipWs();
      if (peek() === "}" || peek() === "]") {
        out = out.replace(/,\s*$/, (m) => {
          repairs.push({ type: "trailing-comma", detail: "Removed trailing comma" });
          return m.replace(",", "");
        });
      }
      continue;
    }

    if (c === "{") {
      pushCommaIfNeeded();
      stack.push("obj");
      out += "{";
      i++;
      expectKey = true;
      afterColon = false;
      needComma = false;
      continue;
    }

    if (c === "[") {
      pushCommaIfNeeded();
      stack.push("arr");
      out += "[";
      i++;
      expectKey = false;
      afterColon = false;
      needComma = false;
      continue;
    }

    if (c === ":") {
      out += ":";
      i++;
      afterColon = true;
      expectKey = false;
      continue;
    }

    pushCommaIfNeeded();

    if (expectKey && !afterColon && stack[stack.length - 1] === "obj") {
      const key = readKey();
      out += key;
      skipWs();
      if (peek() !== ":") {
        out += ":";
        repairs.push({ type: "inserted-colon", detail: "Inserted missing colon after key" });
      }
      expectKey = false;
      continue;
    }

    const value = readValue();
    out += value;
    needComma = true;
    afterColon = false;
    expectKey = stack[stack.length - 1] === "obj";
  }

  while (stack.length) {
    const t = stack.pop();
    out += t === "obj" ? "}" : "]";
    repairs.push({ type: "closed-open", detail: `Closed unclosed ${t === "obj" ? "{" : "["}` });
  }

  return out;

  function readKey(): string {
    skipWs();
    if (peek() === "\"" || peek() === "'") return readString();
    let ident = "";
    while (i < src.length && /[A-Za-z0-9_$\-]/.test(src[i])) {
      ident += src[i];
      i++;
    }
    if (ident) {
      repairs.push({ type: "unquoted-key", detail: ident });
      return JSON.stringify(ident);
    }
    return readValue();
  }

  function readValue(): string {
    skipWs();
    const c = peek();
    if (c === "\"" || c === "'") return readString();
    if (c === "{") return "";
    if (c === "[") return "";
    if (src.startsWith("undefined", i)) {
      i += 9;
      repairs.push({ type: "undefined", detail: "undefined → null" });
      return "null";
    }
    if (src.startsWith("NaN", i)) {
      i += 3;
      repairs.push({ type: "nan", detail: "NaN → null" });
      return "null";
    }
    if (src.startsWith("Infinity", i) || src.startsWith("+Infinity", i) || src.startsWith("-Infinity", i)) {
      const neg = c === "-";
      i += c === "+" || c === "-" ? 9 : 8;
      repairs.push({ type: "infinity", detail: "Infinity → null" });
      return "null";
    }
    let lit = "";
    while (i < src.length && /[^\s,\]\}:]/.test(src[i])) {
      lit += src[i];
      i++;
    }
    if (lit === "True") return "true";
    if (lit === "False") return "false";
    if (lit === "None") return "null";
    if (/^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?$/.test(lit)) return lit;
    if (lit === "true" || lit === "false" || lit === "null") return lit;
    if (lit) {
      repairs.push({ type: "unquoted-string", detail: lit });
      return JSON.stringify(lit);
    }
    return "null";
  }

  function readString(): string {
    const quote = peek();
    i++;
    let raw = "";
    let escape = false;
    while (i < src.length) {
      const ch = src[i];
      if (escape) {
        raw += ch;
        escape = false;
        i++;
        continue;
      }
      if (ch === "\\") {
        raw += ch;
        escape = true;
        i++;
        continue;
      }
      if (ch === quote) {
        i++;
        break;
      }
      if (ch === "\n") {
        raw += "\\n";
        i++;
        repairs.push({ type: "newline-in-string", detail: "Escaped raw newline" });
        continue;
      }
      if (ch === "\t") {
        raw += "\\t";
        i++;
        continue;
      }
      if (ch === "\"" && quote === "'") raw += "\\\"";
      else raw += ch;
      i++;
    }
    if (quote === "'") repairs.push({ type: "single-quotes", detail: "Converted single-quoted string" });
    try {
      return JSON.stringify(JSON.parse(`"${raw.replace(/"/g, "\\\"")}"`));
    } catch {
      return JSON.stringify(raw.replace(/\\"/g, "\""));
    }
  }
}
