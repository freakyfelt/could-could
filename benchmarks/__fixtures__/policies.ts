import { PolicyDocument } from "../../index.js";
import {
  ContextualAllowStatement,
  ContextualDenyStatement,
  GlobAllStatement,
  GlobEndStatement,
  GlobStartStatement,
  MultipleActionsStatement,
} from "./statements.js";

export const ComplexPolicy: PolicyDocument = {
  statement: [
    GlobAllStatement,
    GlobStartStatement,
    GlobEndStatement,
    MultipleActionsStatement,
    ContextualAllowStatement,
    ContextualDenyStatement,
  ],
};

export const GlobAllPolicy: PolicyDocument = {
  statement: [GlobAllStatement],
};
