import { RulesLogic } from "json-logic-js";

export type PolicyStore = Map<string, ResourcePolicy>;
export type ResourcePolicy = Map<string, RulesLogic>;
