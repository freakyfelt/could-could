import { type PolicyDocument } from "../../..";
import { BasicResourcePolicy } from "./valid";

export const MissingActionsPolicy: PolicyDocument = {
  ...BasicResourcePolicy,
  actions: undefined,
} as any;

export const EmptyActionsPolicy: PolicyDocument = {
  ...BasicResourcePolicy,
  actions: [],
};

/** missing the 'create' constraint */
export const DiscoveredActionPolicy: PolicyDocument = {
  ...BasicResourcePolicy,
  actions: BasicResourcePolicy.actions.filter(
    (action) => action !== BasicResourcePolicy.policies[0].action
  ),
};

export const InvalidConstraintPolicy: PolicyDocument = {
  ...BasicResourcePolicy,
  policies: [
    {
      action: "create",
      effect: "allow",
      constraint: { foo: "bar" } as any,
    },
  ],
};
