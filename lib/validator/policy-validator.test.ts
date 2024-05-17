import assert from "node:assert";
import { describe, it } from "node:test";
import { PolicyDocumentValidator } from "./policy-validator.js";
import { MalformedPolicyStatementError } from "./errors.js";
import {
  BasicResourcePolicy,
  InvalidConstraintPolicy,
  MultipleActionsPolicy,
} from "../__fixtures__/policies.js";
import {
  GlobAllStatement,
  GlobEndStatement,
  GlobStartStatement,
} from "../__fixtures__/statements.js";

describe("validateResourcePolicy", () => {
  const validator = new PolicyDocumentValidator();

  it("does not throw with a valid resource policy", () => {
    validator.validate(BasicResourcePolicy);
  });

  it("does not throw with a policy that has multiple actions for a definition", () => {
    validator.validate(MultipleActionsPolicy);
  });

  it("is valid with globbed statements", () => {
    validator.validate({
      statement: [GlobAllStatement, GlobStartStatement, GlobEndStatement],
    });
  });

  describe("constraint validations", () => {
    it("throws when a constraint is unparseable", () => {
      assert.throws(
        () => validator.validate(InvalidConstraintPolicy),
        MalformedPolicyStatementError,
      );
    });
  });
});
