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

  describe("addGroup", () => {
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
      expect(store.findAllByAction("read")).toEqual(expected);
      expect(store.findAllByGID("test1")).toEqual(expected);

      const sid = expected[0].sid;
      expect(store.get(sid)).toEqual(expected[0]);
    });
  });
});
