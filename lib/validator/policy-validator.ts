import { Ajv, ValidateFunction } from "ajv";
import jsonLogic from "json-logic-js";
import * as defaultSchema from "../../schemas/policy-2023-02.schema.json" with { type: "json" };
import { JsonLogicParser, JsonSchema, PolicyDocument } from "../types.js";
import { arrayify } from "../utils/arr.js";
import {
  MalformedStatementDetail,
  MalformedPolicyStatementError,
  MalformedPolicyDocumentError,
} from "./errors.js";

interface ValidatorOptions {
  schema?: JsonSchema;
  validator?: ValidateFunction;
  parser?: JsonLogicParser;
}

export class PolicyDocumentValidator {
  static #instance: PolicyDocumentValidator;

  static get instance(): PolicyDocumentValidator {
    if (!this.#instance) {
      this.#instance = new PolicyDocumentValidator();
    }
    return this.#instance;
  }

  private ajv: Ajv;
  private validator: ValidateFunction;
  private parser: JsonLogicParser;

  constructor(
    schema?: JsonSchema,
    { validator, parser }: ValidatorOptions = {},
  ) {
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

      console.error({ details });
      console.dir({ doc }, { depth: 10 });
      throw new MalformedPolicyDocumentError(doc, details);
    }

    this.validateConstraints(doc);
  }

  /**
   * Checks that the document has listed all actions in its policy definitions, plus ensures
   * that the constraints contained within each action policy definition are evaluatable by
   * our parser (JsonLogic usually)
   */
  private validateConstraints(doc: PolicyDocument): void {
    const invalidStatements: MalformedStatementDetail[] = [];

    arrayify(doc.statement).forEach((policy) => {
      try {
        this.parser.apply(policy.constraint);
      } catch (error) {
        invalidStatements.push({ policy, error });
      }
    });

    if (invalidStatements.length) {
      throw new MalformedPolicyStatementError(invalidStatements);
    }
  }
}
