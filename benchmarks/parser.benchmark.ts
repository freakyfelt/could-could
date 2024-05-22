import Benchmark from "benchmark";
import { parsePolicyStatement } from "../index.js";
import {
  BasicAllowStatement,
  GlobAllStatement,
  GlobStartStatement,
  MultipleActionsStatement,
} from "./__fixtures__/statements.js";

export function buildParserBenchmarks() {
  return new Benchmark.Suite("parsePolicyStatement Benchmarks")
    .add("single", () => parsePolicyStatement(BasicAllowStatement))
    .add("multiple", () => parsePolicyStatement(MultipleActionsStatement))
    .add("glob", () => parsePolicyStatement(GlobAllStatement))
    .add("regex", () => parsePolicyStatement(GlobStartStatement));
}
