import { RulesLogic } from "json-logic-js";
import { randomUUID } from "node:crypto";
import { PolicyStatement } from "./types";
import { traverseRulesLogic } from "./utils/logic";
import {
  isStringLiteral,
  isValidPattern,
  regexFromPattern,
} from "./utils/regex";

export type ActionsByType = {
  exact: string[];
  regex: RegExp[];
  globAll: boolean;
};

export type ParsedPolicyStatement = {
  /** a globally-unique statement identifier */
  sid: string;
  /** an optional grouping identifier for things like policy documents */
  gid: string;

  effect: PolicyStatement["effect"];
  constraint: PolicyStatement["constraint"];
  /** paths referenced in the logic with { var: 'my.path' } */
  contextPaths: string[];
  actionsByType: ActionsByType;
};

const LIST_OPS = ["map", "reduce", "filter", "all", "none", "some"];

function extractVarPaths(logic: RulesLogic): string[] {
  const paths: string[] = [];

  traverseRulesLogic(
    logic,
    (innerLogic, path) => {
      // context gets blown away in list operations. Stop descending.
      if (path.length && LIST_OPS.includes(path[path.length - 1] as string)) {
        return false;
      }
      if (typeof innerLogic !== "object" || !("var" in innerLogic)) {
        return;
      }

      // syntactic sugar means var could be one of string, [string], or [string, string]
      const args = Array.isArray(innerLogic.var)
        ? innerLogic.var
        : [innerLogic.var];
      if (typeof args[0] !== "string") {
        throw new Error(
          `var: only path strings are permitted (at ${path.join(".")})`
        );
      }
      if (args.length === 1) {
        // only track the ones that do NOT have a default (arg 2)
        paths.push(args[0]);
      }
    },
    ["var", ...LIST_OPS]
  );

  return paths;
}

export function parsePolicyActions(actions: string[]): ActionsByType {
  const res: ActionsByType = { exact: [], regex: [], globAll: false };

  for (const action of actions) {
    if (action === "*") {
      // this should be the only thing and, even if not, it will match all operations
      res.globAll = true;
      return res;
    } else if (isStringLiteral(action)) {
      res.exact.push(action);
    } else if (isValidPattern(action)) {
      const regexp = regexFromPattern(action);
      res.regex.push(regexp);
    } else {
      throw new Error(`Invalid action pattern: '${action}'`);
    }
  }

  return res;
}

interface ParseOptions {
  sid?: string;
  gid?: string;
}

export function parsePolicyStatement(
  statement: PolicyStatement,
  opts: ParseOptions = {}
): ParsedPolicyStatement {
  const { action, constraint, effect } = statement;
  const actions = Array.isArray(action) ? action : [action];

  const sid = opts.sid ?? randomUUID();
  const gid = opts.gid ?? sid;

  return {
    sid,
    gid,

    effect,
    constraint,
    contextPaths: extractVarPaths(constraint),
    actionsByType: parsePolicyActions(actions),
  };
}
