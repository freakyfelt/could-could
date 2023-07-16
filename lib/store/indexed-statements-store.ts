import uniq from "just-unique";
import assert from "node:assert";
import { ParsedPolicyStatement } from "../parsed-policy-statement";
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
  byGID: Map<string, string[]>;
};

const createStatementsDB = (): StatementsDBWithIndex => ({
  statements: new Map(),
  byAction: {
    exact: new Map(),
    globAll: [],
    regex: [],
  },
  byGID: new Map(),
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
  #byGID: Map<string, string[]>;

  constructor(params?: StatementsDBWithIndex) {
    super();

    const { statements, byAction, byGID } = params ?? createStatementsDB();
    this.#statements = statements;
    this.#byAction = byAction;
    this.#byGID = byGID;
  }

  /**
   * adds or replaces an individual statement in the store by statement id (sid)
   *
   * @param newStatement
   */
  set(sid: string, newStatement: ParsedPolicyStatement) {
    this.addAll([
      {
        ...newStatement,
        sid,
        gid: undefined,
      },
    ]);
  }

  addAll(statements: ParsedPolicyStatement[]) {
    const sids = this.#addAll(statements);
    this.#reindexAll(sids);
    this.emit("updated", sids);
  }

  /** adds or replaces a group of statements in the store by group ID (gid) */
  setGroup(gid: string, statements: ParsedPolicyStatement[]) {
    const existingSIDs = this.#byGID.get(gid) ?? [];
    this.#deleteAll(existingSIDs);

    const namespacedStatements = statements.map((s) => ({
      ...s,
      gid,
      sid: [gid, s.sid].join("/"),
    }));

    const sids = this.#addAll(namespacedStatements);
    const allSIDs = uniq([...existingSIDs, ...sids]);
    this.#byGID.set(gid, sids);
    this.#reindexAll(allSIDs);
    this.emit("updated", allSIDs);
  }

  delete(sid: string) {
    this.deleteAll([sid]);
  }

  deleteAll(sids: string[]) {
    this.#deleteAll(sids);
    this.#reindexAll(sids);
    this.emit("updated", sids);
  }

  deleteGroup(gid: string) {
    const sids = this.#byGID.get(gid);
    if (!sids) {
      return;
    }
    this.#byGID.delete(gid);
    this.#deleteAll(sids);
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

  findAllByGID(gid: string): ParsedPolicyStatement[] {
    return this.#byGID.get(gid)?.map((sid) => this.#mustGet(sid)) ?? [];
  }

  #addAll(statements: ParsedPolicyStatement[]): string[] {
    return statements.map((statement) => {
      const sid = statement.sid;
      this.#statements.set(sid, statement);
      return sid;
    });
  }

  /** deleteAll removes all sids without reindexing or sending updates */
  #deleteAll(sids: string[]) {
    sids.forEach((sid) => {
      this.#statements.delete(sid);
    });
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
    if (sids.length === 0) {
      return;
    }
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
      .map((s) => s.sid);
    this.#byAction.globAll = [
      ...this.#byAction.globAll.filter((id) => !sids.includes(id)),
      ...globAll,
    ];

    const regex = statements.flatMap((s) =>
      s.actionsByType.regex.map((re): [RegExp, string] => [re, s.sid]),
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
        arr.push(statement.sid);
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
        ...existing.filter((sid) => !sids.includes(sid)),
        ...updates,
      ];
      updated.length === 0
        ? this.#byAction.exact.delete(action)
        : this.#byAction.exact.set(action, updated);
    }
  }
}
