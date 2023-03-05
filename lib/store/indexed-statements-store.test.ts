import {
  BasicAllowStatement,
  GlobAllStatement,
  GlobEndStatement,
  GlobStartStatement,
  MultipleActionsStatement,
} from "../__fixtures__/parsed-statements";
import { IndexedStatementsStore } from "./indexed-statements-store";

describe("IndexedStatementsStore", () => {
  describe("findAllByAction", () => {
    const store = new IndexedStatementsStore();
    store.addAll([
      BasicAllowStatement,
      MultipleActionsStatement,
      GlobAllStatement,
      GlobEndStatement,
      GlobStartStatement,
    ]);
    it("returns the expected statements for create", () => {
      const res = store.findAllByAction("create");
      expect(res).toEqual([
        GlobAllStatement,
        BasicAllowStatement,
        MultipleActionsStatement,
      ]);
    });

    it("returns the expected statements for prefixed actions", () => {
      const res = store.findAllByAction("documents:sign");
      expect(res).toEqual([GlobAllStatement, GlobEndStatement]);
    });

    it("returns the expected statements for postfixed", () => {
      const res = store.findAllByAction("sign:documents");
      expect(res).toEqual([GlobAllStatement, GlobStartStatement]);
    });

    it("returns the expected statements for read", () => {
      const res = store.findAllByAction("read");
      expect(res).toEqual([GlobAllStatement, MultipleActionsStatement]);
    });
  });

  describe("add/deleteGroup", () => {
    let store: IndexedStatementsStore;

    beforeEach(() => {
      store = new IndexedStatementsStore();
    });

    const gid = "test1";
    const toAdd = [GlobAllStatement, MultipleActionsStatement];
    const expected = toAdd.map((s) => ({
      ...s,
      gid,
      sid: [gid, s.sid].join("/"),
    }));

    it("adds the statements to all of the expected store methods", () => {
      store.addGroup(gid, toAdd);
      store.add(MultipleActionsStatement);
      expect(store.findAllByAction("read")).toEqual([
        ...expected,
        MultipleActionsStatement,
      ]);
      expect(store.findAllByGID(gid)).toEqual(expected);

      const sid = expected[0].sid;
      expect(store.get(sid)).toEqual(expected[0]);
    });

    it("removes the statements from all of the expected store methods", () => {
      store.addGroup(gid, toAdd);
      store.add(MultipleActionsStatement);
      store.deleteGroup(gid);

      expect(store.findAllByAction("read")).toEqual([MultipleActionsStatement]);
      expect(store.findAllByGID(gid)).toEqual([]);

      const sid = expected[0].sid;
      expect(store.get(sid)).toEqual(undefined);
    });
  });
});
