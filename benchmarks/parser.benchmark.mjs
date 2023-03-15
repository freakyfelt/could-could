import Benchmark from "benchmark";
import { parsePolicyStatement } from "../dist/lib/parsed-policy-statement.js";
import {
  BasicAllowStatement,
  GlobAllStatement,
  GlobStartStatement,
  MultipleActionsStatement,
} from "./__fixtures__/statements.mjs";

export function buildParserBenchmarks() {
  return new Benchmark.Suite("parsePolicyStatement Benchmarks")
    .add("single", () => parsePolicyStatement(BasicAllowStatement))
    .add("multiple", () => parsePolicyStatement(MultipleActionsStatement))
    .add("glob", () => parsePolicyStatement(GlobAllStatement))
    .add("regex", () => parsePolicyStatement(GlobStartStatement));
}
