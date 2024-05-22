import { type PolicyDocument } from "../types.js";
import {
  BasicAllowStatement,
  InvalidConstraintStatement,
  MultipleActionsStatement,
} from "./statements.js";

export const BasicResourcePolicy: PolicyDocument = {
  statement: [BasicAllowStatement],
};

export const MultipleActionsPolicy: PolicyDocument = {
  statement: [MultipleActionsStatement],
};

export const InvalidConstraintPolicy: PolicyDocument = {
  statement: [InvalidConstraintStatement],
};
