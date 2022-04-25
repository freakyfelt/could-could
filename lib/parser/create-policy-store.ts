import { ResourcePolicyDocument } from "../types";
import { ResourcePolicyParser } from "./resource-policy-parser";
import { PolicyStore } from "./types";

interface CreatePolicyStoreInput {
  policies: ResourcePolicyDocument[];
  targetEnvironment: string;
  policyParser?: ResourcePolicyParser;
}

export function createPolicyStore(input: CreatePolicyStoreInput): PolicyStore {
  const policyParser = input.policyParser ?? new ResourcePolicyParser();
  const policyStore: PolicyStore = new Map();

  input.policies.forEach((doc) => {
    if (policyStore.has(doc.resourceType)) {
      throw new Error(`already have definition for ${doc.resourceType}`);
    }

    policyStore.set(
      doc.resourceType,
      policyParser.parse({ doc, targetEnvironment: input.targetEnvironment })
    );
  });

  return policyStore;
}
