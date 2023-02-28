import { parsePolicyStatement } from "../parsed-policy-statement";

export const GlobAllStatement = parsePolicyStatement(
  {
    action: "*",
    effect: "allow",
    constraint: true,
  },
  "GlobAllStatement"
);

export const GlobStartStatement = parsePolicyStatement(
  {
    action: "*:documents",
    effect: "allow",
    constraint: true,
  },
  "GlobStartStatement"
);

export const GlobEndStatement = parsePolicyStatement(
  {
    action: "documents:*",
    effect: "allow",
    constraint: true,
  },
  "GlobEndStatement"
);

export const BasicAllowStatement = parsePolicyStatement(
  {
    action: "create",
    effect: "allow",
    constraint: true,
  },
  "BasicAllowStatement"
);

export const MultipleActionsStatement = parsePolicyStatement(
  {
    action: ["create", "read"],
    effect: "allow",
    constraint: true,
  },
  "MultipleActionsStatement"
);

export const allowedContext = {
  subject: {
    id: 1234,
  },
  doc: {
    createdBy: 1234,
  },
};

export const ContextualAllowStatement = parsePolicyStatement(
  {
    action: "create",
    effect: "allow",
    constraint: {
      "===": [{ var: "subject.id" }, { var: "doc.createdBy" }],
    },
  },
  "ContextualAllowStatement"
);

export const deniedContext = {
  subject: {
    groups: ["group5"],
  },
};

export const ContextualDenyStatement = parsePolicyStatement(
  {
    action: "create",
    effect: "deny",
    constraint: {
      some: [{ var: "subject.groups" }, { in: [{ var: "" }, ["group5"]] }],
    },
  },
  "ContextualDenyStatement"
);

export const InvalidConstraintStatement = parsePolicyStatement(
  {
    action: "create",
    effect: "allow",
    constraint: { foo: "bar" } as any,
  },
  "InvalidConstraintStatement"
);
