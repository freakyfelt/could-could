import { parsePolicyStatement } from "./parsed-policy-statement";
import { PolicyResolver } from "./policy-resolver";
import { IndexedStatementsStore } from "./store";
import {
  Actions,
  allowedContext,
  deniedContext,
} from "./__fixtures__/contexts";
import {
  BasicAllowStatement,
  ContextualAllowStatement,
  ContextualDenyStatement,
  ContextualGlobStatement,
  GlobAllStatement,
  GlobEndStatement,
  GlobStartStatement,
  MultipleActionsStatement,
} from "./__fixtures__/statements";

describe("PolicyParser", () => {
  describe("with a basic allow policy", () => {
    const policies = PolicyResolver.fromStatements([BasicAllowStatement]);

    it("returns true for the create action", () => {
      expect(policies.can(Actions.create)).toEqual(true);
    });

    it("returns false for another defined action", () => {
      expect(policies.can(Actions.read)).toEqual(false);
    });
  });

  describe("with a multiple action policy", () => {
    const policies = PolicyResolver.fromStatements([MultipleActionsStatement]);
    const allowed = [Actions.create, Actions.read];

    it("returns true for both actions", () => {
      allowed.forEach((action) => {
        expect(policies.can(action)).toEqual(true);
      });
    });

    it("returns false for any other action", () => {
      expect(policies.can("should_not_exist")).toEqual(false);
    });
  });

  describe("glob matching", () => {
    const policies = PolicyResolver.fromStatements([
      ContextualGlobStatement,
      GlobStartStatement,
      GlobEndStatement,
    ]);

    it("matches actions matching the glob end", () => {
      expect(policies.can(Actions.createDocument)).toEqual(true);
      expect(policies.can(Actions.readDocument)).toEqual(true);
      expect(policies.can(`${Actions.readDocument}aaaaaaaa`)).toEqual(true);
    });

    it("matches actions matching the glob start", () => {
      expect(policies.can(Actions.signDocuments)).toEqual(true);
      expect(policies.can(`aaaaaa${Actions.signDocuments}`)).toEqual(true);
    });

    it("returns true for the contextual glob", () => {
      expect(policies.can(Actions.read)).toEqual(false);
      expect(policies.can(Actions.read, allowedContext)).toEqual(true);
    });

    describe("with an allowed actions list provided", () => {
      const allowedActions = [Actions.readDocument, Actions.createDocument];
      const policies = PolicyResolver.fromStatements([GlobAllStatement], {
        allowedActions,
      });

      it("returns false for unknown actions", () => {
        expect(policies.can(Actions.readDocument)).toEqual(true);
        expect(policies.can(`${Actions.readDocument}aaaaaaaa`)).toEqual(false);
      });
    });
  });

  describe("with a basic contextual resource policy", () => {
    const policies = PolicyResolver.fromStatements([
      BasicAllowStatement,
      ContextualDenyStatement,
    ]);

    it("rejects a subject that matches the deny criteria", () => {
      expect(policies.can(Actions.create, deniedContext)).toEqual(false);
    });

    it("allows a subject that does not match the deny criteria", () => {
      expect(policies.can(Actions.create, allowedContext)).toEqual(true);
    });
  });

  describe("with a contextual resource policy containing an in constraint", () => {
    const policies = PolicyResolver.fromStatements([
      ContextualAllowStatement,
      ContextualDenyStatement,
    ]);

    it("rejects a subject that matches the deny criteria", () => {
      expect(policies.can(Actions.create, deniedContext)).toEqual(false);
    });

    it("allows a subject that does not match the deny criteria but matches the allow criteria", () => {
      expect(policies.can(Actions.create, allowedContext)).toEqual(true);
    });

    it("returns false if an allow statement is missing a required context", () => {
      expect(policies.can(Actions.create)).toEqual(false);
    });

    it("returns false if a deny statement is missing a required context", () => {
      const policies = PolicyResolver.fromStatements([ContextualDenyStatement]);

      expect(policies.can(Actions.create)).toEqual(false);
    });
  });

  describe("caching", () => {
    let store: IndexedStatementsStore;
    let resolver: PolicyResolver;

    beforeEach(() => {
      const parsed = [ContextualAllowStatement, ContextualDenyStatement].map(
        (s) => parsePolicyStatement(s)
      );
      store = new IndexedStatementsStore();
      store.addAll(parsed);

      resolver = new PolicyResolver(store);
    });

    it("caches the evaluator for future executions", () => {
      const spy = jest.spyOn(store, "findAllByAction");

      expect(resolver.can(Actions.create, allowedContext)).toEqual(true);
      expect(resolver.can(Actions.create, allowedContext)).toEqual(true);

      expect(spy).toHaveBeenCalledTimes(1);
    });

    it("resets the cache on store updates", () => {
      const spy = jest.spyOn(store, "findAllByAction");

      expect(resolver.can(Actions.create, allowedContext)).toEqual(true);
      expect(spy).toHaveBeenCalledTimes(1);

      store.delete("ContextualAllowStatement");

      expect(resolver.can(Actions.create, allowedContext)).toEqual(false);
      expect(spy).toHaveBeenCalledTimes(2);
    });
  });
});
