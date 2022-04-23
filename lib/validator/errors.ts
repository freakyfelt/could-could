import type { ActionPolicyDefinition, ResourcePolicyDocument } from "../types";

export abstract class ValidatorError extends Error {}

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

export class MalformedActionPoliciesError extends ValidatorError {
  public readonly details: MalformedActionPoliciesDetail[];

  constructor(details: MalformedActionPoliciesDetail[]) {
    super("One or more invalid action policies detected");
    this.details = details;
  }
}
