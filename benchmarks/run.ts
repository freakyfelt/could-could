import Benchmark from "benchmark";
import process, { stderr, stdout } from "node:process";
import { buildParserBenchmarks } from "./parser.benchmark.js";
import { buildPolicyDocumentValidatorBenchmarks } from "./validator.benchmark.js";
import { buildPolicyResolverBenchmarks } from "./policy-resolver.benchmark.js";

function runSuite(suite: Benchmark.Suite) {
  stdout.write(`
## ${suite.name}

| Test Name | Pass/Fail | ops/sec | variance | samples (n) |
| --------- | --------- | ------- | -------- | ----------- |
`);

  suite
    .on("cycle", (event: Benchmark.Event) => {
      const bench = event.target;

      // @ts-expect-error target error does not seem to exist
      if (typeof bench.error !== "undefined") {
        stderr.write(
          `${JSON.stringify({
            suite: suite.name,
            bench: bench.name,
            // @ts-expect-error target error does to seem to exist
            err: String(bench.error),
          })}\n`,
        );
      }

      const cells = [
        bench.name,
        // @ts-expect-error target error does to seem to exist
        bench.error ? "FAIL" : "PASS",
        `${bench.hz?.toLocaleString()} ops/sec`,
        `\xb1${bench.stats?.rme.toFixed(2)}%`,
        `${bench.stats?.sample.length} samples`,
      ].join(" | ");

      stdout.write(["|", cells, "|\n"].join(" "));
    })
    .run();
}

export function run() {
  const suites = [
    buildPolicyResolverBenchmarks(),
    buildPolicyDocumentValidatorBenchmarks(),
    buildParserBenchmarks(),
  ];

  stdout.write(
    `# could-could performance

Performed on: ${new Date().toDateString()}

Node version: ${process.version}
Platform/Architecture: ${process.platform}/${process.arch}
`,
  );

  suites.forEach((suite) => runSuite(suite));
}

// node run.mjs
run();
