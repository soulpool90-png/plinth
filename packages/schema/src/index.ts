export { repairJson, extractPayload, type Repair, type RepairResult } from "./repair.ts";
export { validateJson, type SchemaError, type ValidateResult } from "./validate.ts";

import { repairJson, type RepairResult } from "./repair.ts";
import { validateJson, type SchemaError } from "./validate.ts";

export type RepairAndValidateResult = RepairResult & {
  valid: boolean;
  schemaErrors: SchemaError[];
};

export function repairAndValidate(input: string, schema: unknown): RepairAndValidateResult {
  const repaired = repairJson(input);
  if (!repaired.ok) {
    return { ...repaired, valid: false, schemaErrors: [] };
  }
  const checked = validateJson(repaired.value, schema);
  return { ...repaired, valid: checked.valid, schemaErrors: checked.errors };
}
