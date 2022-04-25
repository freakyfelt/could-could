import { createPolicyStore } from "../parser";
import { ResourcePolicyDocument } from "../types";
import { PolicyResolver } from "./policy-resolver";

interface CreatePolicyResolverInput {
  policies: ResourcePolicyDocument[];
  targetEnvironment: string;
}

/**
 * Given a list of resource policies and a targetEnvironment creates a resolver
 * that can be used to determine if an action can be taken on a resource type
 *
 * @example
 * const resolver = createPolicyStore({ policies: [kittyPolicy], targetEnvironment: process.env.NODE_ENV })
 *
 * > resolver.can({ action: 'pet', resourceType: 'Kitty' }, { kitty, subject })
 * true
 */
export function createPolicyResolver({
  policies,
  targetEnvironment,
}: CreatePolicyResolverInput): PolicyResolver {
  const policyStore = createPolicyStore({ policies, targetEnvironment });

  return new PolicyResolver(policyStore);
}
