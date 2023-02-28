import {
  BasicAllowStatement,
  GlobAllStatement,
  GlobEndStatement,
  GlobStartStatement,
  MultipleActionsStatement,
} from "../__fixtures__/statements";
import { parsePolicyStatement } from "../parsed-policy-statement";
import { IndexedStatementsStore } from "./indexed-statements-store";

describe("IndexedStatementsStore", () => {
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
