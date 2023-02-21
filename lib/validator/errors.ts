import type { PolicyStatement, PolicyDocument } from "../types";

export abstract class ValidatorError extends Error {}

/**
 * Thrown when the policy document does not match the schema or is missing an action in $.actions
 */
export class MalformedPolicyDocumentError extends ValidatorError {
  public readonly doc: PolicyDocument;
  public readonly details: string;

  constructor(doc: PolicyDocument, details: string) {
    super("Malformed resource policy");
    this.doc = doc;
    this.details = details;
  }
}

export type MalformedStatementDetail = {
  policy: PolicyStatement;
  error: any;
};

/**
 * Thrown when one or more action policies has an unparseable constraint
 */
export class MalformedPolicyStatementError extends ValidatorError {
  public readonly details: MalformedStatementDetail[];

  constructor(details: MalformedStatementDetail[]) {
    super("One or more invalid policy statements detected");
    this.details = details;
  }
}
