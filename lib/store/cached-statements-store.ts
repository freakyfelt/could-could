import LRUCache from "lru-cache";
import assert from "node:assert";
import { ParsedPolicyStatement } from "../parsed-policy-statement";
import { TypedEmitter } from "../utils/events";
import { IndexedStatementsStore } from "./indexed-statements-store";
import { PolicyStatementStore, StoreEvents } from "./types";

interface CachedStoreOptions {
  cache?: LRUCache.Options<string, string[]>;
}

const DEFAULT_CACHE_OPTIONS: LRUCache.Options<string, string[]> = {
  max: 1000,
};

/**
 * Stores statements and allows for fetching matching statements by action
 */
export class CachedStatementsStore
  extends TypedEmitter<StoreEvents>
  implements PolicyStatementStore
{
  #store: PolicyStatementStore;
  #cache: LRUCache<string, string[]>;

  constructor(store?: PolicyStatementStore, opts: CachedStoreOptions = {}) {
    super();

    this.#cache = new LRUCache({ ...DEFAULT_CACHE_OPTIONS, ...opts.cache });
    this.#store = store ?? new IndexedStatementsStore();
    this.#store.on("updated", (sids) => {
      this.#cache.clear();
      this.emit("updated", sids);
    });
  }

  add(statement: ParsedPolicyStatement) {
    this.#store.add(statement);
  }

  addAll(statements: ParsedPolicyStatement[]) {
    this.#store.addAll(statements);
  }

  addGroup(gid: string, statements: ParsedPolicyStatement[]): void {
    this.#store.addGroup(gid, statements);
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
        this.#store.findAllByAction(action).map((p) => p.sid)
      );
    }

    return this.#cache.get(action)?.map((sid) => this.#mustGet(sid)) ?? [];
  }

  findAllByGID(gid: string): ParsedPolicyStatement[] {
    return this.#store.findAllByGID(gid);
  }

  #mustGet(sid: string): ParsedPolicyStatement {
    const statement = this.#store.get(sid);

    assert.ok(statement, `no statement with sid '${sid}'`);

    return statement;
  }
}
