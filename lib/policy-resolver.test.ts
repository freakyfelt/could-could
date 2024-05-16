import assert from "node:assert";
import { parsePolicyStatement } from "./parsed-policy-statement.js";
import { PolicyResolver } from "./policy-resolver.js";
import { IndexedStatementsStore } from "./store/index.js";
import {
  Actions,
  allowedContext,
  deniedContext,
} from "./__fixtures__/contexts.js";
import {
  BasicAllowStatement,
  ContextualAllowStatement,
  ContextualDenyStatement,
  ContextualGlobStatement,
  GlobAllStatement,
  GlobEndStatement,
  GlobStartStatement,
  MultipleActionsStatement,
} from "./__fixtures__/statements.js";

describe("PolicyParser", () => {
  describe("with a basic allow policy", () => {
    const policies = PolicyResolver.fromStatements([BasicAllowStatement]);

    it("returns true for the create action", () => {
      assert.deepEqual(policies.can(Actions.create), true);
    });

    it("returns false for another defined action", () => {
      assert.deepEqual(policies.can(Actions.read), false);
    });
  });

  describe("with a multiple action policy", () => {
    const policies = PolicyResolver.fromStatements([MultipleActionsStatement]);
    const allowed = [Actions.create, Actions.read];

    it("returns true for both actions", () => {
      allowed.forEach((action) => {
        assert.deepEqual(policies.can(action), true);
      });
    });

    it("returns false for any other action", () => {
      assert.deepEqual(policies.can("should_not_exist"), false);
    });
  });

  describe("glob matching", () => {
    const policies = PolicyResolver.fromStatements([
      ContextualGlobStatement,
      GlobStartStatement,
      GlobEndStatement,
    ]);

    it("matches actions matching the glob end", () => {
      assert.deepEqual(policies.can(Actions.createDocument), true);
      assert.deepEqual(policies.can(Actions.readDocument), true);
      assert.deepEqual(policies.can(`${Actions.readDocument}aaaaaaaa`), true);
    });

    it("matches actions matching the glob start", () => {
      assert.deepEqual(policies.can(Actions.signDocuments), true);
      assert.deepEqual(policies.can(`aaaaaa${Actions.signDocuments}`), true);
    });

    it("returns true for the contextual glob", () => {
      assert.deepEqual(policies.can(Actions.read), false);
      assert.deepEqual(policies.can(Actions.read, allowedContext), true);
    });

    describe("with an allowed actions list provided", () => {
      const allowedActions = [Actions.readDocument, Actions.createDocument];
      const policies = PolicyResolver.fromStatements([GlobAllStatement], {
        allowedActions,
      });

      it("returns false for unknown actions", () => {
        assert.equal(policies.can(Actions.readDocument), true);
        assert.equal(policies.can(`${Actions.readDocument}aaaaaaaa`), false);
      });
    });
  });

  describe("with a basic contextual resource policy", () => {
    const policies = PolicyResolver.fromStatements([
      BasicAllowStatement,
      ContextualDenyStatement,
    ]);

    it("rejects a subject that matches the deny criteria", () => {
      assert.equal(policies.can(Actions.create, deniedContext), false);
    });

    it("allows a subject that does not match the deny criteria", () => {
      assert.equal(policies.can(Actions.create, allowedContext), true);
    });
  });

  describe("with a contextual resource policy containing an in constraint", () => {
    const policies = PolicyResolver.fromStatements([
      ContextualAllowStatement,
      ContextualDenyStatement,
    ]);

    it("rejects a subject that matches the deny criteria", () => {
      assert.equal(policies.can(Actions.create, deniedContext), false);
    });

    it("allows a subject that does not match the deny criteria but matches the allow criteria", () => {
      assert.equal(policies.can(Actions.create, allowedContext), true);
    });

    it("returns false if an allow statement is missing a required context", () => {
      assert.deepEqual(policies.can(Actions.create), false);
    });

    it("returns false if a deny statement is missing a required context", () => {
      const policies = PolicyResolver.fromStatements([ContextualDenyStatement]);

      assert.deepEqual(policies.can(Actions.create), false);
    });
  });

  describe("caching", () => {
    let store: IndexedStatementsStore;
    let resolver: PolicyResolver;

    beforeEach(() => {
      const parsed = [ContextualAllowStatement, ContextualDenyStatement].map(
        (s) => parsePolicyStatement(s),
      );
      store = new IndexedStatementsStore();
      store.addAll(parsed);

      resolver = new PolicyResolver(store);
    });

    it("caches the evaluator for future executions", () => {
      const spy = jest.spyOn(store, "findAllByAction");

      assert.deepEqual(resolver.can(Actions.create, allowedContext), true);
      assert.deepEqual(resolver.can(Actions.create, allowedContext), true);

      expect(spy).toHaveBeenCalledTimes(1);
    });

    it("resets the cache on store updates", () => {
      const spy = jest.spyOn(store, "findAllByAction");

      assert.equal(resolver.can(Actions.create, allowedContext), true);
      expect(spy).toHaveBeenCalledTimes(1);

      store.delete("ContextualAllowStatement");

      assert.equal(resolver.can(Actions.create, allowedContext), false);
      expect(spy).toHaveBeenCalledTimes(2);
    });
  });
});
