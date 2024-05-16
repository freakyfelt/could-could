import type { PolicyStatement } from "../../index.js";

export const GlobAllStatement: PolicyStatement = {
  sid: "GlobAllStatement",
  action: "*",
  effect: "allow",
  constraint: true,
};

export const GlobStartStatement: PolicyStatement = {
  sid: "GlobStartStatement",
  action: "*:documents",
  effect: "allow",
  constraint: true,
};

export const GlobEndStatement: PolicyStatement = {
  sid: "GlobEndStatement",
  action: "documents:*",
  effect: "allow",
  constraint: true,
};

export const BasicAllowStatement: PolicyStatement = {
  sid: "BasicAllowStatement",
  action: "create",
  effect: "allow",
  constraint: true,
};

export const MultipleActionsStatement: PolicyStatement = {
  sid: "MultipleActionsStatement",
  action: ["create", "read"],
  effect: "allow",
  constraint: true,
};

export const ContextualAllowStatement: PolicyStatement = {
  sid: "ContextualAllowStatement",
  action: "create",
  effect: "allow",
  constraint: {
    "===": [{ var: "subject.id" }, { var: "doc.allowedBy" }],
  },
};

export const ContextualGlobAllowStatement: PolicyStatement = {
  sid: "ContextualGlobAllowStatement",
  action: "documents:*",
  effect: "allow",
  constraint: {
    "===": [{ var: "subject.id" }, { var: "doc.allowedBy" }],
  },
};

export const ContextualGlobAllAllowStatement: PolicyStatement = {
  sid: "ContextualGlobAllAllowStatement",
  action: "*",
  effect: "allow",
  constraint: {
    "===": [{ var: "subject.id" }, { var: "doc.globAllowedBy" }],
  },
};

export const ContextualDenyStatement: PolicyStatement = {
  sid: "ContextualDenyStatement",
  action: "create",
  effect: "deny",
  constraint: {
    "===": [{ var: "subject.id" }, { var: "doc.deniedBy" }],
  },
};

export const ContextualGlobDenyStatement: PolicyStatement = {
  sid: "ContextualGlobDenyStatement",
  action: "documents:*",
  effect: "deny",
  constraint: {
    "===": [{ var: "subject.id" }, { var: "doc.deniedBy" }],
  },
};

export const ContextualGlobAllDenyStatement: PolicyStatement = {
  sid: "ContextualGlobAllDenyStatement",
  action: "*",
  effect: "deny",
  constraint: {
    "===": [{ var: "subject.id" }, { var: "doc.globDeniedBy" }],
  },
};

const toContext = (subjectId: string) => ({
  subject: {
    id: subjectId,
  },
  doc: {
    allowedBy: "allowed",
    deniedBy: "denied",
    globAllowedBy: "globAllowed",
    globDeniedBy: "globDenied",
  },
});

export type BencharkContext = ReturnType<typeof toContext>;

export const allowContext = toContext("allowed");
export const denyContext = toContext("denied");
export const allowAllContext = toContext("globAllowed");
export const denyAllContext = toContext("globDenied");
