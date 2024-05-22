import * as statements from "./statements.js";
import { parsePolicyStatement } from "../parsed-policy-statement.js";

export const GlobAllStatement = parsePolicyStatement(
  statements.GlobAllStatement,
);
export const GlobEndStatement = parsePolicyStatement(
  statements.GlobEndStatement,
);
export const GlobStartStatement = parsePolicyStatement(
  statements.GlobStartStatement,
);

export const BasicAllowStatement = parsePolicyStatement(
  statements.BasicAllowStatement,
);
export const MultipleActionsStatement = parsePolicyStatement(
  statements.MultipleActionsStatement,
);
export const ContextualAllowStatement = parsePolicyStatement(
  statements.ContextualAllowStatement,
);
export const ContextualDenyStatement = parsePolicyStatement(
  statements.ContextualDenyStatement,
);
export const ContextualGlobStatement = parsePolicyStatement(
  statements.ContextualGlobStatement,
);
