import { type ResourcePolicyDocument } from "../../..";
import { BasicResourcePolicy } from "./valid";

export const MissingActionsPolicy: ResourcePolicyDocument = {
  ...BasicResourcePolicy,
  actions: undefined,
} as any;

export const EmptyActionsPolicy: ResourcePolicyDocument = {
  ...BasicResourcePolicy,
  actions: [],
};

/** missing the 'create' constraint */
export const DiscoveredActionPolicy: ResourcePolicyDocument = {
  ...BasicResourcePolicy,
  actions: BasicResourcePolicy.actions.filter(
    (action) => action !== BasicResourcePolicy.definitions[0].policies[0].action
  ),
};

export const InvalidConstraintPolicy: ResourcePolicyDocument = {
  ...BasicResourcePolicy,
  definitions: [
    {
      environment: "test",
      policies: [
        {
          action: "create",
          effect: "allow",
          constraint: { foo: "bar" } as any,
        },
      ],
    },
  ],
};
