import assert from "node:assert";
import { ParsedPolicyStatement, SYM_SID } from "../parsed-policy-statement";
import { PolicyStatementStore } from "./types";
import { IndexedStatementsStore } from "./indexed-statements-store";

/**
 * Stores statements and allows for fetching matching statements by action
 */
export class CachedStatementsStore implements PolicyStatementStore {
  #store: PolicyStatementStore;
  #cache: Map<string, string[]>;

  constructor(store?: PolicyStatementStore) {
    this.#store = store ?? new IndexedStatementsStore();
    this.#cache = new Map();
  }

  add(statement: ParsedPolicyStatement) {
    this.#store.add(statement);
    this.#cache = new Map();
  }

  addAll(statements: ParsedPolicyStatement[]) {
    this.#store.addAll(statements);
    this.#cache = new Map();
  }

  get(sid: string): ParsedPolicyStatement | undefined {
    return this.#store.get(sid);
  }

  has(sid: string): boolean {
    return this.#store.has(sid);
  }

  findAllByAction(action: string): ParsedPolicyStatement[] {
    if (!this.#cache.get(action)) {
      this.#cache.set(
        action,
        this.#store.findAllByAction(action).map((p) => p[SYM_SID])
      );
    }

    return this.#cache.get(action)?.map((sid) => this.#mustGet(sid)) ?? [];
  }

  #mustGet(sid: string): ParsedPolicyStatement {
    const statement = this.#store.get(sid);

    assert.ok(statement, `no statement with sid '${sid}'`);

    return statement;
  }
}
