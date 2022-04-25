import jsonLogic from "json-logic-js";

import { PolicyStore } from "../parser/types";
import { JsonLogicParser } from "../types";

interface ResourceActionResolverOptions {
  parser?: JsonLogicParser;
}

interface CanInput {
  action: string;
  resourceType: string;
}

export class PolicyResolver {
  private policyStore: PolicyStore;
  private parser: JsonLogicParser;

  constructor(
    policyStore: PolicyStore,
    opts: ResourceActionResolverOptions = {}
  ) {
    this.policyStore = policyStore;
    this.parser = opts.parser ?? jsonLogic;
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
    const logic = this.policyStore.get(resourceType)?.get(action);
    if (!logic) {
      throw new Error(
        `Unknown resource/action combination: '${resourceType}', '${action}'`
      );
    }

    return this.parser.apply(logic, context);
  }
}
