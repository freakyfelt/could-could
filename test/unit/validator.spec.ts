import { ResourcePolicyValidator } from "../..";
import {
  MalformedActionPoliciesError,
  MalformedResourcePolicyError,
} from "../../lib/validator/errors";
import {
  DiscoveredActionPolicy,
  EmptyActionsPolicy,
  InvalidConstraintPolicy,
  MissingActionsPolicy,
} from "../fixtures/policies/invalid";
import {
  BasicResourcePolicy,
  MultipleActionsPolicy,
} from "../fixtures/policies/valid";

describe("validateResourcePolicy", () => {
  const validator = new ResourcePolicyValidator();

  it("does not throw with a valid resource policy", () => {
    expect(() => validator.validate(BasicResourcePolicy)).not.toThrowError();
  });

  it("does not throw with a policy that has multiple actions for a definition", () => {
    expect(() => validator.validate(MultipleActionsPolicy)).not.toThrowError();
  });

  describe("actions validations", () => {
    it("throws when $.actions is missing", () => {
      expect(() => validator.validate(MissingActionsPolicy)).toThrowError(
        MalformedResourcePolicyError
      );
    });

    it("throws when $.actions is an empty array", () => {
      expect(() => validator.validate(EmptyActionsPolicy)).toThrowError(
        MalformedResourcePolicyError
      );
    });

    it("throws when an action is missing from $.actions", () => {
      expect(() => validator.validate(DiscoveredActionPolicy)).toThrowError(
        MalformedResourcePolicyError
      );
    });
  });

  describe("constraint validations", () => {
    it("throws when a constraint is unparseable", () => {
      expect(() => validator.validate(InvalidConstraintPolicy)).toThrowError(
        MalformedActionPoliciesError
      );
    });
  });
});
