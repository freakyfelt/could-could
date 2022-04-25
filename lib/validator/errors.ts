import type { ActionPolicyDefinition, ResourcePolicyDocument } from "../types";

export abstract class ValidatorError extends Error {}

/**
 * Thrown when the policy document does not match the schema or is missing an action in $.actions
 */
export class MalformedResourcePolicyError extends ValidatorError {
  public readonly doc: ResourcePolicyDocument;
  public readonly details: string;

  constructor(doc: ResourcePolicyDocument, details: string) {
    super("Malformed resource policy");
    this.doc = doc;
    this.details = details;
  }
}

export type MalformedActionPoliciesDetail = {
  policy: ActionPolicyDefinition;
  error: any;
};

/**
 * Thrown when one or more action policies has an unparseable constraint
 */
export class MalformedActionPoliciesError extends ValidatorError {
  public readonly details: MalformedActionPoliciesDetail[];

  constructor(details: MalformedActionPoliciesDetail[]) {
    super("One or more invalid action policies detected");
    this.details = details;
  }
}
