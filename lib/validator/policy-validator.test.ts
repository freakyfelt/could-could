import { PolicyDocumentValidator } from "../..";
import { MalformedPolicyStatementError } from "./errors";
import {
  BasicResourcePolicy,
  InvalidConstraintPolicy,
  MultipleActionsPolicy,
} from "../__fixtures__/policies";
import {
  BasicAllowStatement,
  GlobAllStatement,
  GlobEndStatement,
  GlobStartStatement,
  MultipleActionsStatement,
} from "../__fixtures__/statements";

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
      expect(() => validator.validate(InvalidConstraintPolicy)).toThrowError(
        MalformedPolicyStatementError
      );
    });
  });
});
