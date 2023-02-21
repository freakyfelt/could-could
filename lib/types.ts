import type { JSONSchemaType } from "ajv";
import type { RulesLogic } from "json-logic-js";

export interface JsonLogicParser {
  apply<TVars>(logic: RulesLogic, vars?: TVars): boolean;
}
export type JsonSchema = JSONSchemaType<unknown>;

export interface PolicyDocument {
  actions: string[];
  policies: PolicyStatement[];
}

export interface PolicyStatement {
  action: string | string[];
  effect: "allow" | "deny";
  constraint: RulesLogic;
}
