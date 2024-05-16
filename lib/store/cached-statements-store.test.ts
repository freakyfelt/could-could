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
      const spy = jest.spyOn(source, "findAllByAction");

      const res1 = store.findAllByAction(Actions.readDocument);
      const res2 = store.findAllByAction(Actions.readDocument);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(res1).toEqual(res2);

      const res3 = store.findAllByAction(Actions.read);

      expect(spy).toBeCalledTimes(2);
      expect(res3).not.toEqual(res2);
    });

    it("resets the cache after the source has a new statement added", () => {
      const spy = jest.spyOn(source, "findAllByAction");

      store.findAllByAction(Actions.readDocument);
      source.set("ContextualDenyStatement", ContextualDenyStatement);
      store.findAllByAction(Actions.readDocument);

      expect(spy).toHaveBeenCalledTimes(2);
    });

    it("resets the cache after the source has a statement deleted", () => {
      const spy = jest.spyOn(source, "findAllByAction");

      store.findAllByAction(Actions.readDocument);
      source.delete("BasicAllowStatement");
      store.findAllByAction(Actions.readDocument);

      expect(spy).toHaveBeenCalledTimes(2);
    });
  });
});
