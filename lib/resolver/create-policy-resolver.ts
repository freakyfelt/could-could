import { createPolicyStore } from "../parser";
import { ResourcePolicyDocument } from "../types";
import { PolicyResolver } from "./policy-resolver";

interface CreatePolicyResolverInput {
  policies: ResourcePolicyDocument[];
  targetEnvironment: string;
}

export function createPolicyResolver({
  policies,
  targetEnvironment,
}: CreatePolicyResolverInput): PolicyResolver {
  const policyStore = createPolicyStore({ policies, targetEnvironment });

  return new PolicyResolver(policyStore);
}
