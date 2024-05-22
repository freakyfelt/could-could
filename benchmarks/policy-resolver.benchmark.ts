import Benchmark from "benchmark";
import assert from "node:assert";
import {
  CachedStatementsStore,
  IndexedStatementsStore,
  PolicyResolver,
  PolicyStatementStore,
  parsePolicyStatement,
} from "../index.js";
import {
  allowAllContext,
  allowContext,
  BasicAllowStatement,
  BencharkContext,
  ContextualAllowStatement,
  ContextualDenyStatement,
  ContextualGlobAllAllowStatement,
  ContextualGlobAllDenyStatement,
  ContextualGlobAllowStatement,
  ContextualGlobDenyStatement,
  denyAllContext,
  denyContext,
  GlobEndStatement,
  GlobStartStatement,
  MultipleActionsStatement,
} from "./__fixtures__/statements.js";

const indexed = new IndexedStatementsStore();
indexed.addAll(
  [
    ContextualAllowStatement,
    ContextualDenyStatement,
    ContextualGlobAllowStatement,
    ContextualGlobDenyStatement,
    ContextualGlobAllAllowStatement,
    ContextualGlobAllDenyStatement,
    GlobStartStatement,
    MultipleActionsStatement,
  ].map((s) => parsePolicyStatement(s)),
);

const cached = new CachedStatementsStore(indexed);

const resUncached = new PolicyResolver(indexed);
const resCached = new PolicyResolver(cached);

const indexedNoCtx = new IndexedStatementsStore();
indexedNoCtx.addAll(
  [
    BasicAllowStatement,
    GlobEndStatement,
    GlobStartStatement,
    MultipleActionsStatement,
  ].map((s) => parsePolicyStatement(s)),
);
const cachedNoCtx = new CachedStatementsStore(indexedNoCtx);

const resUncachedNoCtx = new PolicyResolver(indexedNoCtx);
const resCachedNoCtx = new PolicyResolver(cachedNoCtx);

/**
 *
 * @param {IndexedStatementsStore|CachedStatementsStore} store
 */
const withNewResolver = (
  store: PolicyStatementStore,
  expected: boolean,
  action: string,
  ctx?: BencharkContext,
) => {
  const res = new PolicyResolver(store);
  // @ts-expect-error removeAllListeners is not present on emitter
  store.removeAllListeners();
  assert(res.can(action, ctx) === expected);
};

const withResolver = (
  resolver: PolicyResolver,
  expected: boolean,
  action: string,
  ctx?: BencharkContext,
) => {
  assert(resolver.can(action, ctx) === expected);
};

// labels are `{label}:{resolverType}:{storeType}:{effect}`

const addActionTests = (
  suite: Benchmark.Suite,
  action: string,
  label: string,
) => {
  suite
    .add(`${label}:new:uncached:ctx:allow`, () =>
      withNewResolver(indexed, true, action, allowContext),
    )
    .add(`${label}:new:cached:ctx:allow`, () =>
      withNewResolver(cached, true, action, allowContext),
    )
    .add(`${label}:new:uncached:ctx:deny`, () =>
      withNewResolver(indexed, false, action, denyContext),
    )
    .add(`${label}:new:cached:ctx:deny`, () =>
      withNewResolver(cached, false, action, denyContext),
    )

    .add(`${label}:new:uncached:noctx:allow`, () =>
      withNewResolver(indexedNoCtx, true, action),
    )
    .add(`${label}:new:cached:noctx:allow`, () =>
      withNewResolver(cachedNoCtx, true, action),
    )

    .add(`${label}:instance:uncached:ctx:allow`, () =>
      withResolver(resUncached, true, action, allowContext),
    )
    .add(`${label}:instance:cached:ctx:allow`, () =>
      withResolver(resCached, true, action, allowContext),
    )
    .add(`${label}:instance:uncached:ctx:deny`, () =>
      withResolver(resUncached, false, action, denyContext),
    )
    .add(`${label}:instance:cached:ctx:deny`, () =>
      withResolver(resCached, false, action, denyContext),
    )

    .add(`${label}:instance:uncached:noctx:allow`, () =>
      withResolver(resUncachedNoCtx, true, action),
    )
    .add(`${label}:instance:cached:noctx:allow`, () =>
      withResolver(resCachedNoCtx, true, action),
    );
};

export function buildPolicyResolverBenchmarks() {
  const suite = new Benchmark.Suite("PolicyResolver Benchmarks");
  suite
    .add("globAll:new:uncached:ctx:allow", () =>
      withNewResolver(indexed, true, "anything", allowAllContext),
    )
    .add("globAll:new:cached:ctx:allow", () =>
      withNewResolver(cached, true, "anything", allowAllContext),
    )
    .add("globAll:instance:uncached:ctx:deny", () =>
      withResolver(resUncached, false, "anything", denyAllContext),
    )
    .add("globAll:instance:cached:ctx:deny", () =>
      withResolver(resCached, false, "anything", denyAllContext),
    );
  addActionTests(suite, "documents:createDocument", "globStart");
  addActionTests(suite, "create", "exact");

  return suite;
}
