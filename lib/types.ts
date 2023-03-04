import type { JSONSchemaType } from "ajv";
import type { RulesLogic } from "json-logic-js";

export interface JsonLogicParser {
  apply<TVars>(logic: RulesLogic, vars?: TVars): boolean;
}
export type JsonSchema = JSONSchemaType<unknown>;

export interface PolicyDocument {
  /** an optional document identifier for replacing/removing a policy */
  id?: string;
  /** an optional description */
  description?: string;
  statement: PolicyStatement | PolicyStatement[];
}

export interface PolicyStatement {
  /** a statement identifier (document scoped) */
  sid?: string;
  /** an optional description */
  description?: string;
  action: string | string[];
  effect: "allow" | "deny";
  constraint: RulesLogic;
}
