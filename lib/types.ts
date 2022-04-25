import type { JSONSchemaType } from "ajv";
import type { RulesLogic } from "json-logic-js";

export interface JsonLogicParser {
  apply<TVars>(logic: RulesLogic, vars?: TVars): boolean;
}
export type JsonSchema = JSONSchemaType<unknown>;

export interface ResourcePolicyDocument {
  resourceType: string;
  actions: string[];
  definitions: EnvironmentPolicyDefinition[];
}

export interface EnvironmentPolicyDefinition {
  environment: string | string[];
  policies: ActionPolicyDefinition[];
}

export interface ActionPolicyDefinition {
  action: string | string[];
  effect: "allow" | "deny";
  constraint: RulesLogic;
}
