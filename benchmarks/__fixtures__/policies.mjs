import {
  ContextualAllowStatement,
  ContextualDenyStatement,
  GlobAllStatement,
  GlobEndStatement,
  GlobStartStatement,
  MultipleActionsStatement,
} from "./statements.mjs";

export const ComplexPolicy = {
  statement: [
    GlobAllStatement,
    GlobStartStatement,
    GlobEndStatement,
    MultipleActionsStatement,
    ContextualAllowStatement,
    ContextualDenyStatement,
  ],
};

export const GlobAllPolicy = {
  statement: [GlobAllStatement],
};
