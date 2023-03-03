import assert from "node:assert";
import { ParsedPolicyStatement, SYM_SID } from "../parsed-policy-statement";
import { TypedEmitter } from "../utils/events";
import {
  ParsedStatementsDB,
  ByActionIndex,
  PolicyStatementStore,
  StoreEvents,
} from "./types";

type StatementsDBWithIndex = {
  statements: ParsedStatementsDB;
  byAction: ByActionIndex;
};

const createStatementsDB = (): StatementsDBWithIndex => ({
  statements: new Map(),
  byAction: {
    exact: new Map(),
    globAll: [],
    regex: [],
  },
});

/**
 * Stores statements and allows for fetching matching statements by action
 */
export class IndexedStatementsStore
  extends TypedEmitter<StoreEvents>
  implements PolicyStatementStore
{
  #statements: ParsedStatementsDB;
  #byAction: ByActionIndex;

  constructor(params?: StatementsDBWithIndex) {
    super();

    const { statements, byAction } = params ?? createStatementsDB();
    this.#statements = statements;
    this.#byAction = byAction;
  }

  add(newStatement: ParsedPolicyStatement) {
    this.addAll([newStatement]);
  }

  addAll(statements: ParsedPolicyStatement[]) {
    const sids = statements.map((statement) => {
      const sid = statement[SYM_SID];
      this.#statements.set(sid, statement);
      return sid;
    });
    this.#reindexAll(sids);
    this.emit("updated", sids);
  }

  get(sid: string): ParsedPolicyStatement | undefined {
    return this.#statements.get(sid);
  }

  has(sid: string): boolean {
    return Boolean(this.#statements.get(sid));
  }

  findAllByAction(action: string): ParsedPolicyStatement[] {
    return this.#findSidsByAction(action).map((sid) => this.#mustGet(sid));
  }

  #findSidsByAction(action: string): string[] {
    const statementIds = [...this.#byAction.globAll];

    if (this.#byAction.exact.has(action)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      statementIds.push(...this.#byAction.exact.get(action)!);
    }
    for (const [regexp, sid] of this.#byAction.regex) {
      if (regexp.test(action)) {
        statementIds.push(sid);
      }
    }

    return Array.from(new Set(statementIds));
  }

  #mustGet(sid: string): ParsedPolicyStatement {
    const statement = this.#statements.get(sid);

    assert.ok(statement, `no statement with sid '${sid}'`);

    return statement;
  }

  #reindexAll(sids: string[]) {
    const statements: ParsedPolicyStatement[] = [];

    sids.forEach((sid) => {
      const statement = this.#statements.get(sid);

      if (!statement) {
        return;
      } else {
        statements.push(statement);
      }
    });

    const globAll = statements
      .filter((s) => s.actionsByType.globAll)
      .map((s) => s[SYM_SID]);
    this.#byAction.globAll = [
      ...this.#byAction.globAll.filter((id) => !sids.includes(id)),
      ...globAll,
    ];

    const regex = statements.flatMap((s) =>
      s.actionsByType.regex.map((re): [RegExp, string] => [re, s[SYM_SID]])
    );
    this.#byAction.regex = [
      ...this.#byAction.regex.filter(([_regex, id]) => !sids.includes(id)),
      ...regex,
    ];

    // reindex by action instead of sid
    const exact = new Map<string, string[]>();
    statements.forEach((statement) => {
      statement.actionsByType.exact.forEach((action) => {
        const arr = exact.get(action) ?? [];
        arr.push(statement[SYM_SID]);
        exact.set(action, arr);
      });
    });

    const allActions = new Set([
      ...exact.keys(),
      ...this.#byAction.exact.keys(),
    ]);
    for (const action of allActions) {
      const existing = this.#byAction.exact.get(action) ?? [];
      const updates = exact.get(action) ?? [];
      const updated = [
        ...existing.filter((sid) => sids.includes(sid)),
        ...updates,
      ];
      this.#byAction.exact.set(action, updated);
    }
  }
}
