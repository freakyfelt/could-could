import { type PolicyDocument } from "../../..";

export const BasicResourcePolicy: PolicyDocument = {
  actions: ["create", "read", "update", "delete"],
  policies: [
    {
      action: "create",
      effect: "allow",
      constraint: true,
    },
  ],
};

export const MultipleActionsPolicy: PolicyDocument = {
  actions: ["create", "read", "update", "delete"],
  policies: [
    {
      action: ["create", "read"],
      effect: "allow",
      constraint: true,
    },
  ],
};

export const BasicDenyPolicy: PolicyDocument = {
  ...BasicResourcePolicy,
  policies: [
    {
      action: "create",
      effect: "deny",
      constraint: {
        "==": [{ var: "subject.id" }, { var: "doc.createdBy" }],
      },
    },
  ],
};

export const BasicContextualResourcePolicy: PolicyDocument = {
  ...BasicResourcePolicy,
  policies: [
    ...BasicResourcePolicy.policies,
    {
      action: "create",
      effect: "deny",
      constraint: {
        "==": [{ var: "subject.id" }, { var: "doc.createdBy" }],
      },
    },
  ],
};

export const InContextResourcePolicy: PolicyDocument = {
  ...BasicContextualResourcePolicy,
  policies: [
    ...BasicResourcePolicy.policies,
    {
      action: "create",
      effect: "deny",
      constraint: {
        some: [
          { var: "subject.groups" },
          { in: [{ var: "" }, ["group1", "group5"]] },
        ],
      },
    },
  ],
};
