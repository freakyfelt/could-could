import Ajv, { ValidateFunction } from "ajv";
import * as jsonLogic from "json-logic-js";
import * as defaultSchema from "./schema.json";
import { JsonLogicParser, JsonSchema, ResourcePolicyDocument } from "../types";

import {
  MalformedActionPoliciesDetail,
  MalformedActionPoliciesError,
  MalformedResourcePolicyError,
} from "./errors";

interface ValidateResourcePolicyInput {
  schema?: JsonSchema;
  validator?: ValidateFunction;
  parser?: JsonLogicParser;
}

export class ResourcePolicyValidator {
  private ajv: Ajv;
  private validator: ValidateFunction;
  private parser: JsonLogicParser;

  constructor({ schema, validator, parser }: ValidateResourcePolicyInput = {}) {
    this.parser = parser ?? jsonLogic;

    this.ajv = new Ajv({ allErrors: true });
    if (validator) {
      this.validator = validator;
    } else if (schema) {
      this.validator = this.ajv.compile(schema);
    } else {
      this.validator = this.ajv.compile(defaultSchema);
    }
  }

  validate(doc: ResourcePolicyDocument): void {
    if (!this.validator(doc)) {
      const details = this.ajv.errorsText(this.validator.errors);

      throw new MalformedResourcePolicyError(doc, details);
    }

    this.validateDefinedActions(doc);
  }

  private validateDefinedActions(doc: ResourcePolicyDocument): void {
    const discoveredActions = new Set<string>();
    const invalidActionPolicies: MalformedActionPoliciesDetail[] = [];

    doc.definitions.forEach((envPolicy) => {
      envPolicy.policies.forEach((policy) => {
        if (Array.isArray(policy.action)) {
          policy.action.forEach((action) => discoveredActions.add(action));
        } else {
          discoveredActions.add(policy.action);
        }

        try {
          this.parser.apply(policy.constraint);
        } catch (error) {
          invalidActionPolicies.push({ policy, error });
        }
      });
    });

    const allowedActions = new Set([...doc.actions, "*"]);
    const missingActions = new Set<string>();
    discoveredActions.forEach((action) => {
      if (!allowedActions.has(action)) {
        missingActions.add(action);
      }
    });

    if (missingActions.size > 0) {
      throw new MalformedResourcePolicyError(
        doc,
        `Unlisted actions found: '${Array.from(missingActions).join("', ")}'`
      );
    }
    if (invalidActionPolicies.length) {
      throw new MalformedActionPoliciesError(invalidActionPolicies);
    }
  }
}
