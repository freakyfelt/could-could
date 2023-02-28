import { type PolicyDocument } from "../types";
import {
  BasicAllowStatement,
  InvalidConstraintStatement,
  MultipleActionsStatement,
} from "./statements";

export const BasicResourcePolicy: PolicyDocument = {
  statement: [BasicAllowStatement],
};

export const MultipleActionsPolicy: PolicyDocument = {
  statement: [MultipleActionsStatement],
};

export const InvalidConstraintPolicy: PolicyDocument = {
  statement: [InvalidConstraintStatement],
};
