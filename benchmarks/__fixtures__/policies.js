import {
  ContextualAllowStatement,
  ContextualDenyStatement,
  GlobAllStatement,
  GlobEndStatement,
  GlobStartStatement,
  MultipleActionsStatement,
} from "./statements.js";

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
