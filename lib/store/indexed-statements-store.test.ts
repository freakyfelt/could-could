import assert from "node:assert";
import { beforeEach, describe, it } from "node:test";
import { Actions } from "../__fixtures__/contexts.js";
import {
  BasicAllowStatement,
  GlobAllStatement,
  GlobEndStatement,
  GlobStartStatement,
  MultipleActionsStatement,
} from "../__fixtures__/parsed-statements.js";
import { IndexedStatementsStore } from "./indexed-statements-store.js";

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
      const res = store.findAllByAction(Actions.create);
      assert.deepEqual(res, [
        GlobAllStatement,
        BasicAllowStatement,
        MultipleActionsStatement,
      ]);
    });

    it("returns the expected statements for prefixed actions", () => {
      const res = store.findAllByAction(Actions.readDocument);
      assert.deepEqual(res, [GlobAllStatement, GlobEndStatement]);
    });

    it("returns the expected statements for postfixed", () => {
      const res = store.findAllByAction(Actions.signDocuments);
      assert.deepEqual(res, [GlobAllStatement, GlobStartStatement]);
    });

    it("returns the expected statements for read", () => {
      const res = store.findAllByAction(Actions.read);
      assert.deepEqual(res, [GlobAllStatement, MultipleActionsStatement]);
    });
  });

  describe("set/delete", () => {
    let store: IndexedStatementsStore;

    const sid = GlobEndStatement.sid;

    beforeEach(() => {
      store = new IndexedStatementsStore();
    });

    it("adds the statement to all of the expected store methods", () => {
      store.set(sid, GlobEndStatement);

      assert.deepEqual(store.findAllByAction(Actions.createDocument), [
        GlobEndStatement,
      ]);
      assert.equal(store.has(sid), true);
      assert.deepEqual(store.get(sid), GlobEndStatement);
    });

    it("removes the statement from all of the expected store methods", () => {
      store.set(sid, GlobEndStatement);
      store.delete(sid);

      assert.deepEqual(store.findAllByAction(Actions.createDocument), []);
      assert.equal(store.has(sid), false);
      assert.equal(store.get(sid), undefined);
    });
  });

  describe("set/deleteGroup", () => {
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
      store.setGroup(gid, toAdd);
      store.set(MultipleActionsStatement.sid, MultipleActionsStatement);
      assert.deepStrictEqual(store.findAllByAction(Actions.read), [
        ...expected,
        MultipleActionsStatement,
      ]);
      assert.deepEqual(store.findAllByGID(gid), expected);

      const sid = expected[0].sid;
      assert.deepEqual(store.get(sid), expected[0]);
    });

    it("removes the statements from all of the expected store methods", () => {
      store.setGroup(gid, toAdd);
      store.set(MultipleActionsStatement.sid, MultipleActionsStatement);
      store.deleteGroup(gid);

      assert.deepEqual(store.findAllByAction(Actions.read), [
        MultipleActionsStatement,
      ]);
      assert.deepEqual(store.findAllByGID(gid), []);

      const sid = expected[0].sid;
      assert.equal(store.get(sid), undefined);
    });

    it("quietly succeeds if the group is not present", () => {
      store.set(MultipleActionsStatement.sid, MultipleActionsStatement);
      store.deleteGroup(gid);

      assert.deepEqual(store.findAllByAction(Actions.read), [
        MultipleActionsStatement,
      ]);
      assert.deepEqual(store.findAllByGID(gid), []);
    });
  });
});
