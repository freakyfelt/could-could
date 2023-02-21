import jsonLogic, { RulesLogic } from "json-logic-js";

import { PolicyDocumentValidator } from "../validator";
import type {
  PolicyStatement,
  JsonLogicParser,
  PolicyDocument,
} from "../types";
import type { PolicyStore } from "./types";

interface ResourcePolicyParserOptions {
  constraintParser?: JsonLogicParser;
  policyValidator?: PolicyDocumentValidator;
}

/**
 * Creates a Map of all policies that either mention an action or are global to all actions (`"*"`)
 *
 * @param policies a list of action policies to map
 * @param actions a predefined list of possible actions
 * @returns
 */
function mapPoliciesToActions(
  policies: PolicyStatement[],
  actions: string[]
): Map<string, PolicyStatement[]> {
  // Pre-populate the list of actions so we can set '*' actions appropriately
  const policiesByAction = new Map<string, PolicyStatement[]>();
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
  private policyValidator: PolicyDocumentValidator;

  constructor(opts: ResourcePolicyParserOptions = {}) {
    this.policyValidator =
      opts.policyValidator ?? new PolicyDocumentValidator();
  }

  parseAll(docs: PolicyDocument[]): PolicyStore {
    const actions: Set<string> = new Set();
    const policies: PolicyStatement[] = [];
    docs.forEach((doc) => {
      this.policyValidator.validate(doc);
      doc.actions.forEach((action) => actions.add(action));
      policies.push(...doc.policies);
    });

    return this.parse({ actions: Array.from(actions), policies });
  }

  /** Parses a resource policy document and returns a Map<action, RulesLogic> */
  parse(doc: PolicyDocument): PolicyStore {
    this.policyValidator.validate(doc);

    const policiesByAction = mapPoliciesToActions(doc.policies, doc.actions);

    const policy: PolicyStore = new Map();
    policiesByAction.forEach((policies, action) => {
      policy.set(action, this.compileActionPolicies(policies));
    });

    return policy;
  }

  private compileActionPolicies(policies: PolicyStatement[]): RulesLogic {
    const toAllow: RulesLogic[] = [];
    const toDeny: RulesLogic[] = [];

    policies.forEach((policy) => {
      if (policy.effect === "deny") {
        toDeny.push(policy.constraint);
      } else {
        toAllow.push(policy.constraint);
      }
    });

    const allow: RulesLogic =
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
    const deny: RulesLogic =
      toDeny.length === 0
        ? true // default to permitted if no deny constraints were defined
        : {
            // Using some to bail as soon as one deny statement passes, then ! to negate
            "!": {
              some: [toDeny, { "===": [{ var: "" }, true] }],
            },
          };

    return { and: [deny, allow] };
  }
}
