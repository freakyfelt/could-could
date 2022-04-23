import { type ResourcePolicyDocument } from "../../..";

export const BasicResourcePolicy: ResourcePolicyDocument = {
  resource: "FooResource",
  actions: ["create", "read", "update", "delete"],
  definitions: [
    {
      environment: "*",
      policies: [
        {
          action: "create",
          effect: "allow",
          constraint: true,
        },
      ],
    },
  ],
};

export const MultipleActionsPolicy: ResourcePolicyDocument = {
  resource: "FooResource",
  actions: ["create", "read", "update", "delete"],
  definitions: [
    {
      environment: "*",
      policies: [
        {
          action: ["create", "read"],
          effect: "allow",
          constraint: true,
        },
      ],
    },
  ],
};
