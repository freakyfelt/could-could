import jsonLogic, { RulesLogic } from "json-logic-js";

import { ResourcePolicyValidator } from "../validator";
import type {
  ActionPolicyDefinition,
  JsonLogicParser,
  ResourcePolicyDocument,
} from "../types";
import type { ResourcePolicy } from "./types";

interface ResourcePolicyParserOptions {
  constraintParser?: JsonLogicParser;
  policyValidator?: ResourcePolicyValidator;
}

interface ParseInput {
  doc: ResourcePolicyDocument;
  targetEnvironment: string;
}

/**
 * Creates a Map of all policies that either mention an action or are global to all actions (`"*"`)
 *
 * @param policies a list of action policies to map
 * @param actions a predefined list of possible actions
 * @returns
 */
function mapPoliciesToActions(
  policies: ActionPolicyDefinition[],
  actions: string[]
): Map<string, ActionPolicyDefinition[]> {
  // Pre-populate the list of actions so we can set '*' actions appropriately
  const policiesByAction = new Map<string, ActionPolicyDefinition[]>();
  policiesByAction.set("*", []);
  actions.forEach((action) => policiesByAction.set(action, []));

  policies.forEach((policy) => {
    if (Array.isArray(policy.action)) {
      policy.action.forEach((action) =>
        policiesByAction.get(action)!.push(policy)
      );
    } else {
      policiesByAction.get(policy.action)!.push(policy);
    }
  });

  // Now copy the collected global actions into each action's policies
  const globalActions = policiesByAction.get("*")!;
  policiesByAction.delete("*");
  policiesByAction.forEach((policies, key) =>
    policiesByAction.set(key, [...policies, ...globalActions])
  );

  return policiesByAction;
}

export class ResourcePolicyParser {
  private policyValidator: ResourcePolicyValidator;

  constructor(opts: ResourcePolicyParserOptions = {}) {
    this.policyValidator =
      opts.policyValidator ?? new ResourcePolicyValidator();
  }

  /** Parses a resource policy document for a target environment and returns a Map<action, RulesLogic> */
  parse({ doc, targetEnvironment }: ParseInput): ResourcePolicy {
    this.policyValidator.validate(doc);

    // Find all policies whose environment mentions either our targetEnvironment or '*' (global)
    const relevantPolicies = doc.definitions
      .filter((def) => {
        if (Array.isArray(def.environment)) {
          return def.environment.some((env) =>
            ["*", targetEnvironment].includes(env)
          );
        } else {
          return ["*", targetEnvironment].includes(def.environment);
        }
      })
      .flatMap((def) => def.policies);

    const policiesByAction = mapPoliciesToActions(
      relevantPolicies,
      doc.actions
    );

    const policy: ResourcePolicy = new Map();
    policiesByAction.forEach((policies, action) => {
      policy.set(action, this.compileActionPolicies(policies));
    });

    return policy;
  }

  private compileActionPolicies(
    policies: ActionPolicyDefinition[]
  ): RulesLogic {
    const toAllow: RulesLogic[] = [];
    const toDeny: RulesLogic[] = [];

    policies.forEach((policy) => {
      if (policy.effect === "deny") {
        toDeny.push(policy.constraint);
      } else {
        toAllow.push(policy.constraint);
      }
    });

    const allow =
      toAllow.length === 0
        ? false // default to false (denied) as the fallback
        : {
            some: [
              // only one check has to pass to be permitted
              toAllow,
              // For each item ({ var: "" }) check if any resolved value equals true
              { "===": [{ var: "" }, true] },
            ],
          };
    const deny =
      toDeny.length === 0
        ? true // default to permitted if no deny constraints were defined
        : {
            none: [
              // all checks must be false
              toDeny,
              // For each item ({ var: "" }) check if any resolved value equals true
              { "===": [{ var: "" }, true] },
            ],
          };

    return { and: [allow, deny] } as any;
  }
}
