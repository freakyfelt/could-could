import Ajv, { ValidateFunction } from "ajv";
import * as jsonLogic from "json-logic-js";
import * as defaultSchema from "./../../schemas/resource-policy-2022-04.schema.json";
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

  /**
   * Checks a provided resource policy document for correctness
   *
   * A correct policy:
   * - matches the schema
   * - lists all possible actions in $.actions
   * - has a parseable constraint
   *
   * @throws {MalformedResourcePolicyError} the document is not well formed
   * @throws {MalformedActionPoliciesError} one or more action policies has an unparseable constraint
   */
  validate(doc: ResourcePolicyDocument): void {
    if (!this.validator(doc)) {
      const details = this.ajv.errorsText(this.validator.errors);

      throw new MalformedResourcePolicyError(doc, details);
    }

    this.validateDefinedActions(doc);
  }

  /**
   * Checks that the document has listed all actions in its policy definitions, plus ensures
   * that the constraints contained within each action policy definition are evaluatable by
   * our parser (JsonLogic usually)
   */
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
