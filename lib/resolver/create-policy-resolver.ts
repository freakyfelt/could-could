import { createPolicyStore } from "../parser";
import { PolicyDocument } from "../types";
import { PolicyResolver } from "./policy-resolver";

/**
 * Given a list of resource policies and a targetEnvironment creates a resolver
 * that can be used to determine if an action can be taken on a resource type
 *
 * @example
 * const resolver = createPolicyStore([kittyPolicy])
 *
 * > resolver.can('kitty:pet', { kitty, subject })
 * true
 */
export function createPolicyResolver(
  policies: PolicyDocument[]
): PolicyResolver {
  const policyStore = createPolicyStore(policies);

  return new PolicyResolver(policyStore);
}
