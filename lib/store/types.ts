import { ParsedPolicyStatement } from "../parsed-policy-statement";
import { PolicyStatement } from "../types";

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

export interface PolicyStatementStore {
  add(statement: ParsedPolicyStatement): void;
  addAll(statements: ParsedPolicyStatement[]): void;
  get(sid: string): ParsedPolicyStatement | undefined;
  has(sid: string): boolean;

  findAllByAction(action: string): ParsedPolicyStatement[];
}
