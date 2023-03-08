import { PolicyStatement } from "../types";

export interface ResourcePolicyDocument {
  resourceType: string;
  actions: string[];
  definitions: EnvironmentPolicyDefinition[];
}

export interface EnvironmentPolicyDefinition {
  environment: string | string[];
  policies: PolicyStatement[];
}

export interface CanInput {
  action: string;
  resourceType: string;
}
