import { ParsedPolicyStatement } from "../parsed-policy-statement.js";
import { Emitter } from "../utils/events.js";

export type ParsedStatementsDB = Map<string, ParsedPolicyStatement>;

export interface ByActionIndex {
  // strings will be a statement ID (sid) mapping to a statement
  exact: Map<string, string[]>;
  globAll: string[];
  /**
   * Will be an array of tuples
   * [
   *   [/needle/, 'sid1']
   * ]
   */
  regex: Array<[RegExp, string]>;
}

export type StoreEvents = {
  /** returns a list of sids that were updated */
  updated: string[];
};

export interface PolicyStatementStore extends Emitter<StoreEvents> {
  get(sid: string): ParsedPolicyStatement | undefined;
  has(sid: string): boolean;
  set(sid: string, statement: ParsedPolicyStatement): void;
  setGroup(gid: string, statements: ParsedPolicyStatement[]): void;
  addAll(statements: ParsedPolicyStatement[]): void;

  findAllByAction(action: string): ParsedPolicyStatement[];
  findAllByGID(gid: string): ParsedPolicyStatement[];
}
