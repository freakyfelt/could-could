import jsonLogic, { RulesLogic } from "json-logic-js";
import { PolicyStatementStore } from "./store/types";
import { JsonLogicParser, PolicyDocument, PolicyStatement } from "./types";
import {
  ParsedPolicyStatement,
  parsePolicyStatement,
} from "./parsed-policy-statement";
import { pathExists } from "./utils/obj";
import { PolicyDocumentValidator } from "./validator";
import { CachedStatementsStore } from "./store/cached-statements-store";
import { IndexedStatementsStore } from "./store/indexed-statements-store";

interface ResourceActionResolverOptions {
  parser?: JsonLogicParser;
}

type CompiledFns<TContext> = {
  can(ctx: TContext): boolean;
  explain(ctx: TContext): ParsedPolicyStatement[];
};

function hasAllPaths(statement: ParsedPolicyStatement, ctx: unknown) {
  if (statement.contextPaths.length === 0) {
    return true;
  }
  if (typeof ctx !== "object" || ctx === null) {
    return false;
  }
  return statement.contextPaths.every((path) =>
    pathExists(ctx as Record<string, unknown>, path)
  );
}

export class PolicyResolver {
  static fromDocuments(docs: PolicyDocument[]): PolicyResolver {
    const validator = new PolicyDocumentValidator();

    const statements = docs.flatMap((doc) => {
      validator.validate(doc);

      return doc.statement;
    });

    return this.fromStatements(statements);
  }

  static fromStatements(statements: PolicyStatement[]): PolicyResolver {
    const parsed = statements.map((statement) =>
      parsePolicyStatement(statement)
    );

    const store = new CachedStatementsStore();
    store.addAll(parsed);

    return new PolicyResolver(store);
  }

  #policyStore: PolicyStatementStore;
  #parser: JsonLogicParser;
  #cache: Map<string, CompiledFns<unknown>>;

  constructor(
    policyStore: PolicyStatementStore,
    opts: ResourceActionResolverOptions = {}
  ) {
    this.#policyStore = policyStore;
    this.#parser = opts.parser ?? jsonLogic;
    this.#cache = new Map();
  }

  /**
   * Determines if an action can be taken given an optional context
   *
   * @param context extra data that can be referenced with { "var": "path.to.resource" }
   */
  can<TContext = unknown>(action: string, context?: TContext): boolean {
    if (!this.#cache.has(action)) {
      this.#cache.set(action, this.#compileAction(action));
    }

    return this.#cache.get(action)!.can(context);
  }

  /**
   * Returns matching policy statements given the action and context
   *
   * @param context extra data that can be referenced with { "var": "path.to.resource" }
   */
  explain<TContext = unknown>(
    action: string,
    context?: TContext
  ): ParsedPolicyStatement[] {
    if (!this.#cache.has(action)) {
      this.#cache.set(action, this.#compileAction(action));
    }

    return this.#cache.get(action)!.explain(context);
  }

  #compileAction<TContext>(action: string): CompiledFns<TContext> {
    const allow: ParsedPolicyStatement[] = [];
    const deny: ParsedPolicyStatement[] = [];

    this.#policyStore.findAllByAction(action).forEach((statement) => {
      statement.effect === "deny"
        ? deny.push(statement)
        : allow.push(statement);
    });

    const explain = (ctx: TContext): ParsedPolicyStatement[] => {
      return [
        ...deny.filter((statement) => this.#apply(statement, ctx)),
        ...allow.filter((statement) => this.#apply(statement, ctx)),
      ];
    };

    const can = (ctx: TContext): boolean => {
      const isDenied = deny.some((statement) => this.#apply(statement, ctx));
      if (isDenied) {
        return false;
      }

      const isAllowed = allow.some((statement) => this.#apply(statement, ctx));
      return isAllowed;
    };

    return { can, explain };
  }

  #apply<TContext>(statement: ParsedPolicyStatement, ctx: TContext) {
    if (!hasAllPaths(statement, ctx)) {
      return false;
    }

    return this.#parser.apply({ or: [statement.constraint, false] }, ctx);
  }
}
