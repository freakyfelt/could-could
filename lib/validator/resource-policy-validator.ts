import Ajv, { ValidateFunction } from "ajv";
import * as jsonLogic from "json-logic-js";
import * as defaultSchema from "./../../schemas/resource-policy-2023-02.schema.json";
import { JsonLogicParser, JsonSchema, PolicyDocument } from "../types";

import {
  MalformedStatementDetail,
  MalformedPolicyStatementError,
  MalformedPolicyDocumentError as MalformedPolicyDocumentError,
} from "./errors";

interface ValidatorOptions {
  schema?: JsonSchema;
  validator?: ValidateFunction;
  parser?: JsonLogicParser;
}

export class PolicyDocumentValidator {
  private ajv: Ajv;
  private validator: ValidateFunction;
  private parser: JsonLogicParser;

  constructor(schema?: JsonSchema, { validator, parser }: ValidatorOptions = {}) {
    this.parser = parser ?? jsonLogic;

    this.ajv = new Ajv({ allErrors: true });
    if (validator) {
      this.validator = validator;
    } else {
      this.validator = this.ajv.compile(schema ?? defaultSchema);
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
  validate(doc: PolicyDocument): void {
    if (!this.validator(doc)) {
      const details = this.ajv.errorsText(this.validator.errors);

      throw new MalformedPolicyDocumentError(doc, details);
    }

    this.validateDefinedActions(doc);
  }

  /**
   * Checks that the document has listed all actions in its policy definitions, plus ensures
   * that the constraints contained within each action policy definition are evaluatable by
   * our parser (JsonLogic usually)
   */
  private validateDefinedActions(doc: PolicyDocument): void {
    const discoveredActions = new Set<string>();
    const invalidActionPolicies: MalformedStatementDetail[] = [];

    doc.policies.forEach((policy) => {
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

    const allowedActions = new Set([...doc.actions, "*"]);
    const missingActions = new Set<string>();
    discoveredActions.forEach((action) => {
      if (!allowedActions.has(action)) {
        missingActions.add(action);
      }
    });

    if (missingActions.size > 0) {
      throw new MalformedPolicyDocumentError(
        doc,
        `Unlisted actions found: '${Array.from(missingActions).join("', ")}'`
      );
    }
    if (invalidActionPolicies.length) {
      throw new MalformedPolicyStatementError(invalidActionPolicies);
    }
  }
}
