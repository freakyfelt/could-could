import { PolicyStatement } from "../types";
import { Actions } from "./contexts";

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
  action: Actions.create,
  effect: "allow",
  constraint: true,
};

export const MultipleActionsStatement: PolicyStatement = {
  sid: "MultipleActionsStatement",
  action: [Actions.create, Actions.read],
  effect: "allow",
  constraint: true,
};

export const ContextualAllowStatement: PolicyStatement = {
  sid: "ContextualAllowStatement",
  action: Actions.create,
  effect: "allow",
  constraint: {
    "===": [{ var: "subject.id" }, { var: "doc.createdBy" }],
  },
};

export const ContextualDenyStatement: PolicyStatement = {
  action: Actions.create,
  effect: "deny",
  sid: "ContextualDenyStatement",
  constraint: {
    some: [{ var: "subject.groups" }, { in: [{ var: "" }, ["group5"]] }],
  },
};

export const ContextualGlobStatement: PolicyStatement = {
  sid: "ContextualGlobStatement",
  action: "*",
  effect: "allow",
  constraint: {
    "===": [{ var: "subject.id" }, { var: "doc.createdBy" }],
  },
};

export const InvalidConstraintStatement: PolicyStatement = {
  sid: "InvalidConstraintStatement",
  action: Actions.create,
  effect: "allow",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constraint: { foo: "bar" } as any,
};
