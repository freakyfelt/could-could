import { beforeEach, describe, it, mock } from "node:test";
import { CachedStatementsStore } from "./cached-statements-store.js";
import { IndexedStatementsStore } from "./indexed-statements-store.js";
import {
  BasicAllowStatement,
  ContextualAllowStatement,
  ContextualDenyStatement,
  GlobAllStatement,
  GlobEndStatement,
} from "../__fixtures__/parsed-statements.js";
import { Actions } from "../__fixtures__/contexts.js";
import assert from "node:assert";

describe("CachedStatementsStore", () => {
  let source: IndexedStatementsStore;
  let store: CachedStatementsStore;
  const statements = [
    BasicAllowStatement,
    ContextualAllowStatement,
    GlobAllStatement,
    GlobEndStatement,
  ];

  beforeEach(() => {
    source = new IndexedStatementsStore();
    source.addAll(statements);

    store = new CachedStatementsStore(source);
  });

  describe("findAllByAction", () => {
    it("caches subsequent requests", () => {
      const spy = mock.method(source, "findAllByAction");

      const res1 = store.findAllByAction(Actions.readDocument);
      const res2 = store.findAllByAction(Actions.readDocument);

      assert.equal(spy.mock.callCount(), 1);
      assert.deepEqual(res1, res2);

      const res3 = store.findAllByAction(Actions.read);

      assert.equal(spy.mock.callCount(), 2);
      assert.notDeepEqual(res3, res2);
    });

    it("resets the cache after the source has a new statement added", () => {
      const spy = mock.method(source, "findAllByAction");

      store.findAllByAction(Actions.readDocument);
      source.set("ContextualDenyStatement", ContextualDenyStatement);
      store.findAllByAction(Actions.readDocument);

      assert.equal(spy.mock.callCount(), 2);
    });

    it("resets the cache after the source has a statement deleted", () => {
      const spy = mock.method(source, "findAllByAction");

      store.findAllByAction(Actions.readDocument);
      source.delete("BasicAllowStatement");
      store.findAllByAction(Actions.readDocument);

      assert.equal(spy.mock.callCount(), 2);
    });
  });
});
