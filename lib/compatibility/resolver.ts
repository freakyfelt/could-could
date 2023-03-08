import type { CanInput, ResourcePolicyDocument } from "./types";
import { createPolicyStore, ResourcePolicyStore } from "./store";

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
}: CreatePolicyResolverInput): ResourcePolicyResolver {
  const policyStore = createPolicyStore({ policies, targetEnvironment });

  return new ResourcePolicyResolver(policyStore);
}

export class ResourcePolicyResolver {
  private policyStore: ResourcePolicyStore;

  constructor(policyStore: ResourcePolicyStore) {
    this.policyStore = policyStore;
  }

  /**
   * Determines if an action can be taken on a given resourceType
   *
   * @param context extra data that can be referenced with { "var": "path.to.resource" }
   */
  can<TContext = unknown>(
    { action, resourceType }: CanInput,
    context?: TContext
  ): boolean {
    if (!this.policyStore.get(resourceType)?.has(action)) {
      throw new Error(
        `Unknown resource/action combination: '${resourceType}', '${action}'`
      );
    }

    return this.policyStore.get(resourceType)?.can(action, context) === true;
  }
}
