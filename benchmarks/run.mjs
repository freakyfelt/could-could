import process, { stderr, stdout } from "node:process";
import { buildParserBenchmarks } from "./parser.benchmark.mjs";
import { buildPolicyDocumentValidatorBenchmarks } from "./validator.benchmark.mjs";
import { buildPolicyResolverBenchmarks } from "./policy-resolver.benchmark.mjs";

/** @param {import('benchmark').Suite} suite */
function runSuite(suite) {
  stdout.write(`
## ${suite.name}

| Test Name | Pass/Fail | ops/sec | variance | samples (n) |
| --------- | --------- | ------- | -------- | ----------- |
`);

  suite
    .on("cycle", (event) => {
      /** @type {import('benchmark').Target} */
      const bench = event.target;

      if (bench.error) {
        stderr.write(
          `${JSON.stringify({
            suite: suite.name,
            bench: bench.name,
            err: String(bench.error),
          })}\n`,
        );
      }

      const cells = [
        bench.name,
        bench.error ? "FAIL" : "PASS",
        `${bench.hz.toLocaleString()} ops/sec`,
        `\xb1${bench.stats.rme.toFixed(2)}%`,
        `${bench.stats.sample.length} samples`,
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
