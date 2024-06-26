import { LRUCache } from "lru-cache";
import assert from "node:assert";
import { ParsedPolicyStatement } from "../parsed-policy-statement.js";
import { TypedEmitter } from "../utils/events.js";
import { IndexedStatementsStore } from "./indexed-statements-store.js";
import { PolicyStatementStore, StoreEvents } from "./types.js";

interface CachedStoreOptions {
  cache?: LRUCache.Options<string, string[], never>;
}

const DEFAULT_CACHE_OPTIONS: LRUCache.Options<string, string[], never> = {
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
  #cache: LRUCache<string, string[], never>;

  constructor(store?: PolicyStatementStore, opts: CachedStoreOptions = {}) {
    super();

    this.#cache = new LRUCache({ ...DEFAULT_CACHE_OPTIONS, ...opts.cache });
    this.#store = store ?? new IndexedStatementsStore();
    this.#store.on("updated", (sids) => {
      this.#cache.clear();
      this.emit("updated", sids);
    });
  }

  set(sid: string, statement: ParsedPolicyStatement) {
    this.#store.set(sid, statement);
  }

  addAll(statements: ParsedPolicyStatement[]) {
    this.#store.addAll(statements);
  }

  setGroup(gid: string, statements: ParsedPolicyStatement[]): void {
    this.#store.setGroup(gid, statements);
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
        this.#store.findAllByAction(action).map((p) => p.sid),
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
