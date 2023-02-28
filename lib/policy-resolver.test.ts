import { PolicyResolver } from "./policy-resolver";
import {
  allowedContext,
  BasicAllowStatement,
  ContextualAllowStatement,
  ContextualDenyStatement,
  deniedContext,
  MultipleActionsStatement,
} from "./__fixtures__/statements";

describe("PolicyParser", () => {
  describe("with a basic allow policy", () => {
    const policies = PolicyResolver.fromStatements([BasicAllowStatement]);

    it("returns true for the create action", () => {
      expect(policies.can("create")).toEqual(true);
    });

    it("returns false for another defined action", () => {
      expect(policies.can("read")).toEqual(false);
    });
  });

  describe("with a multiple action policy", () => {
    const policies = PolicyResolver.fromStatements([MultipleActionsStatement]);
    const allowed = ["create", "read"];

    it("returns true for both actions", () => {
      allowed.forEach((action) => {
        expect(policies.can(action)).toEqual(true);
      });
    });

    it("returns false for any other action", () => {
      expect(policies.can("should_not_exist")).toEqual(false);
    });
  });

  describe("with a basic contextual resource policy", () => {
    const policies = PolicyResolver.fromStatements([
      BasicAllowStatement,
      ContextualDenyStatement,
    ]);

    it("rejects a subject that matches the deny criteria", () => {
      expect(policies.can("create", deniedContext)).toEqual(false);
    });

    it("allows a subject that does not match the deny criteria", () => {
      expect(policies.can("create", allowedContext)).toEqual(true);
    });
  });

  describe("with a contextual resource policy containing an in constraint", () => {
    const policies = PolicyResolver.fromStatements([
      ContextualAllowStatement,
      ContextualDenyStatement,
    ]);

    it("rejects a subject that matches the deny criteria", () => {
      expect(policies.can("create", deniedContext)).toEqual(false);
    });

    it("allows a subject that does not match the deny criteria but matches the allow criteria", () => {
      expect(policies.can("create", allowedContext)).toEqual(true);
    });

    it("returns false if the call is made without required context", () => {
      expect(policies.can("create")).toEqual(false);
    });
  });
});
