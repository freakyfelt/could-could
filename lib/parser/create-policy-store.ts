import { PolicyDocument } from "../types";
import { ResourcePolicyParser } from "./resource-policy-parser";
import { PolicyStore } from "./types";

interface CreatePolicyStoreOptions {
  policyParser?: ResourcePolicyParser;
}

export function createPolicyStore(
  policies: PolicyDocument[],
  opts: CreatePolicyStoreOptions = {}
): PolicyStore {
  const policyParser = opts.policyParser ?? new ResourcePolicyParser();

  return policyParser.parseAll(policies);
}
