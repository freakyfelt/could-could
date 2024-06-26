import Benchmark from "benchmark";
import { PolicyDocumentValidator } from "../index.js";
import { ComplexPolicy, GlobAllPolicy } from "./__fixtures__/policies.js";

const validator = new PolicyDocumentValidator();

export function buildPolicyDocumentValidatorBenchmarks() {
  return new Benchmark.Suite("PolicyDocumentValidator Benchmarks")
    .add("new", () => new PolicyDocumentValidator().validate(ComplexPolicy))
    .add("new:glob", () =>
      new PolicyDocumentValidator().validate(GlobAllPolicy),
    )
    .add("getInstance", () =>
      PolicyDocumentValidator.instance.validate(ComplexPolicy),
    )
    .add("getInstance:glob", () =>
      PolicyDocumentValidator.instance.validate(GlobAllPolicy),
    )
    .add("reuse", () => validator.validate(ComplexPolicy))
    .add("reuse:glob", () => validator.validate(GlobAllPolicy));
}
