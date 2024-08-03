import pathExists from "just-has";
import jsonLogic from "json-logic-js";
import { LRUCache } from "lru-cache";
import { randomUUID } from "node:crypto";
import { CachedStatementsStore } from "./store/cached-statements-store.js";
import { PolicyStatementStore } from "./store/types.js";
import {
  ParsedPolicyStatement,
  parsePolicyStatement,
} from "./parsed-policy-statement.js";
import { JsonLogicParser, PolicyDocument, PolicyStatement } from "./types.js";
import { arrayify } from "./utils/arr.js";
import { PolicyDocumentValidator } from "./validator/index.js";

interface PolicyResolverOptions {
  /** restrict valid actions to only this list */
  allowedActions?: string[];
  validator?: PolicyDocumentValidator;
  parser?: JsonLogicParser;
  cache?: LRUCache.Options<string, CompiledFns<unknown>, never>;
}

const DEFAULT_CACHE_OPTIONS: LRUCache.Options<
  string,
  CompiledFns<unknown>,
  never
> = {
  max: 100,
};

type CompiledFns<TContext> = {
  can(ctx: TContext): boolean;
  explain(ctx: TContext): ParsedPolicyStatement[];
};

type ApplyOptions = {
  onContextMissing: boolean;
};

function hasAllPaths(statement: ParsedPolicyStatement, ctx: unknown) {
  if (statement.contextPaths.length === 0) {
    return true;
  }
  if (typeof ctx !== "object" || ctx === null) {
    return false;
  }
  return statement.contextPaths.every((path) => pathExists(ctx, path));
}

export class PolicyResolver {
  static fromDocuments(
    docs: PolicyDocument[],
    opts: PolicyResolverOptions = {},
  ): PolicyResolver {
    const validator = opts.validator ?? PolicyDocumentValidator.instance;
    const store = new CachedStatementsStore();

    docs.forEach((doc) => {
      validator.validate(doc);

      const gid = doc.id ?? randomUUID();

      const parsed = arrayify(doc.statement).map((statement) =>
        parsePolicyStatement(statement),
      );
      store.setGroup(gid, parsed);
    });

    return new PolicyResolver(store, opts);
  }

  static fromStatements(
    statements: PolicyStatement[],
    opts: PolicyResolverOptions = {},
  ): PolicyResolver {
    const parsed = statements.map((statement) =>
      parsePolicyStatement(statement),
    );

    const store = new CachedStatementsStore();
    store.addAll(parsed);

    return new PolicyResolver(store, opts);
  }

  #allowedActions: string[] | null;
  #policyStore: PolicyStatementStore;
  #parser: JsonLogicParser;
  #cache: LRUCache<string, CompiledFns<unknown>, never>;

  constructor(
    policyStore: PolicyStatementStore,
    opts: PolicyResolverOptions = {},
  ) {
    this.#allowedActions = opts.allowedActions ?? null;
    this.#parser = opts.parser ?? jsonLogic;

    this.#cache = new LRUCache({ ...DEFAULT_CACHE_OPTIONS, ...opts.cache });
    this.#policyStore = policyStore;
    this.#policyStore.on("updated", () => this.#cache.clear());
  }

  /**
   * Determines if an action can be taken given an optional context
   *
   * @param context extra data that can be referenced with { "var": "path.to.resource" }
   */
  can<TContext = unknown>(action: string, context?: TContext): boolean {
    if (this.#allowedActions && !this.#allowedActions.includes(action)) {
      return false;
    }

    if (!this.#cache.has(action)) {
      this.#cache.set(action, this.#compileAction(action));
    }

    return this.#cache.get(action)?.can(context) ?? false;
  }

  /**
   * Returns matching policy statements given the action and context
   *
   * @param context extra data that can be referenced with { "var": "path.to.resource" }
   */
  explain<TContext = unknown>(
    action: string,
    context?: TContext,
  ): ParsedPolicyStatement[] {
    if (this.#allowedActions && !this.#allowedActions.includes(action)) {
      return [];
    }

    if (!this.#cache.has(action)) {
      this.#cache.set(action, this.#compileAction(action));
    }

    return this.#cache.get(action)?.explain(context) ?? [];
  }

  #compileAction<TContext>(action: string): CompiledFns<TContext> {
    const allow: ParsedPolicyStatement[] = [];
    const deny: ParsedPolicyStatement[] = [];

    this.#policyStore.findAllByAction(action).forEach((statement) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      statement.effect === "deny"
        ? deny.push(statement)
        : allow.push(statement);
    });

    const explain = (ctx: TContext): ParsedPolicyStatement[] => {
      return [
        ...deny.filter((statement) =>
          this.#apply(statement, ctx, { onContextMissing: true }),
        ),
        ...allow.filter((statement) =>
          this.#apply(statement, ctx, { onContextMissing: false }),
        ),
      ];
    };

    const can = (ctx: TContext): boolean => {
      const isDenied = deny.some((statement) =>
        this.#apply(statement, ctx, { onContextMissing: true }),
      );
      if (isDenied) {
        return false;
      }

      return allow.some((statement) =>
        this.#apply(statement, ctx, { onContextMissing: false }),
      );
    };

    return { can, explain };
  }

  #apply<TContext>(
    statement: ParsedPolicyStatement,
    ctx: TContext,
    opts: ApplyOptions,
  ): boolean {
    if (!hasAllPaths(statement, ctx)) {
      return opts.onContextMissing;
    }

    return this.#parser.apply(statement.constraint, ctx) === true;
  }
}
