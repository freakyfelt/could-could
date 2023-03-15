export const GlobAllStatement = {
  sid: "GlobAllStatement",
  action: "*",
  effect: "allow",
  constraint: true,
};

export const GlobStartStatement = {
  sid: "GlobStartStatement",
  action: "*:documents",
  effect: "allow",
  constraint: true,
};

export const GlobEndStatement = {
  sid: "GlobEndStatement",
  action: "documents:*",
  effect: "allow",
  constraint: true,
};

export const BasicAllowStatement = {
  sid: "BasicAllowStatement",
  action: "create",
  effect: "allow",
  constraint: true,
};

export const MultipleActionsStatement = {
  sid: "MultipleActionsStatement",
  action: ["create", "read"],
  effect: "allow",
  constraint: true,
};

export const ContextualAllowStatement = {
  sid: "ContextualAllowStatement",
  action: "create",
  effect: "allow",
  constraint: {
    "===": [{ var: "subject.id" }, { var: "doc.allowedBy" }],
  },
};

export const ContextualGlobAllowStatement = {
  sid: "ContextualGlobAllowStatement",
  action: "documents:*",
  effect: "allow",
  constraint: {
    "===": [{ var: "subject.id" }, { var: "doc.allowedBy" }],
  },
};

export const ContextualGlobAllAllowStatement = {
  sid: "ContextualGlobAllAllowStatement",
  action: "*",
  effect: "allow",
  constraint: {
    "===": [{ var: "subject.id" }, { var: "doc.globAllowedBy" }],
  },
};

export const ContextualDenyStatement = {
  sid: "ContextualDenyStatement",
  action: "create",
  effect: "deny",
  constraint: {
    "===": [{ var: "subject.id" }, { var: "doc.deniedBy" }],
  },
};

export const ContextualGlobDenyStatement = {
  sid: "ContextualGlobDenyStatement",
  action: "documents:*",
  effect: "deny",
  constraint: {
    "===": [{ var: "subject.id" }, { var: "doc.deniedBy" }],
  },
};

export const ContextualGlobAllDenyStatement = {
  sid: "ContextualGlobAllDenyStatement",
  action: "*",
  effect: "deny",
  constraint: {
    "===": [{ var: "subject.id" }, { var: "doc.globDeniedBy" }],
  },
};

const toContext = (subjectId) => ({
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
export const allowContext = toContext("allowed");
export const denyContext = toContext("denied");
export const allowAllContext = toContext("globAllowed");
export const denyAllContext = toContext("globDenied");
