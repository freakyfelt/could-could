# could-could performance

Performed on: Tue May 21 2024

Node version: v18.20.3
Platform/Architecture: darwin/arm64

## PolicyResolver Benchmarks

| Test Name | Pass/Fail | ops/sec | variance | samples (n) |
| --------- | --------- | ------- | -------- | ----------- |
| globAll:new:uncached:ctx:allow | PASS | 361,009.655 ops/sec | ±0.73% | 98 samples |
| globAll:new:cached:ctx:allow | PASS | 376,521.632 ops/sec | ±0.21% | 98 samples |
| globAll:instance:uncached:ctx:deny | PASS | 2,074,402.311 ops/sec | ±0.11% | 99 samples |
| globAll:instance:cached:ctx:deny | PASS | 2,002,592.022 ops/sec | ±0.30% | 99 samples |
| globStart:new:uncached:ctx:allow | PASS | 256,762.018 ops/sec | ±0.13% | 93 samples |
| globStart:new:cached:ctx:allow | PASS | 269,616.286 ops/sec | ±0.22% | 100 samples |
| globStart:new:uncached:ctx:deny | PASS | 338,613.332 ops/sec | ±0.19% | 98 samples |
| globStart:new:cached:ctx:deny | PASS | 360,065.172 ops/sec | ±0.53% | 97 samples |
| globStart:new:uncached:noctx:allow | PASS | 536,348.228 ops/sec | ±0.44% | 98 samples |
| globStart:new:cached:noctx:allow | PASS | 572,056.049 ops/sec | ±0.43% | 96 samples |
| globStart:instance:uncached:ctx:allow | PASS | 493,474.7 ops/sec | ±0.10% | 100 samples |
| globStart:instance:cached:ctx:allow | PASS | 492,811.273 ops/sec | ±0.15% | 100 samples |
| globStart:instance:uncached:ctx:deny | PASS | 956,563.926 ops/sec | ±0.24% | 99 samples |
| globStart:instance:cached:ctx:deny | PASS | 950,129.21 ops/sec | ±0.58% | 94 samples |
| globStart:instance:uncached:noctx:allow | PASS | 25,756,046.885 ops/sec | ±0.24% | 102 samples |
| globStart:instance:cached:noctx:allow | PASS | 25,787,071.939 ops/sec | ±0.21% | 102 samples |
| exact:new:uncached:ctx:allow | PASS | 255,064.031 ops/sec | ±0.23% | 98 samples |
| exact:new:cached:ctx:allow | PASS | 267,132.607 ops/sec | ±0.31% | 97 samples |
| exact:new:uncached:ctx:deny | PASS | 333,639.962 ops/sec | ±0.44% | 97 samples |
| exact:new:cached:ctx:deny | PASS | 362,117.391 ops/sec | ±0.24% | 97 samples |
| exact:new:uncached:noctx:allow | PASS | 535,086.004 ops/sec | ±0.42% | 98 samples |
| exact:new:cached:noctx:allow | PASS | 563,254.035 ops/sec | ±0.49% | 96 samples |
| exact:instance:uncached:ctx:allow | PASS | 493,154.648 ops/sec | ±0.09% | 100 samples |
| exact:instance:cached:ctx:allow | PASS | 493,917.788 ops/sec | ±0.18% | 99 samples |
| exact:instance:uncached:ctx:deny | PASS | 968,696.891 ops/sec | ±0.08% | 98 samples |
| exact:instance:cached:ctx:deny | PASS | 957,148.033 ops/sec | ±0.51% | 101 samples |
| exact:instance:uncached:noctx:allow | PASS | 25,719,738.424 ops/sec | ±0.23% | 94 samples |
| exact:instance:cached:noctx:allow | PASS | 25,020,148.235 ops/sec | ±0.92% | 96 samples |

## PolicyDocumentValidator Benchmarks

| Test Name | Pass/Fail | ops/sec | variance | samples (n) |
| --------- | --------- | ------- | -------- | ----------- |
| new | FAIL | 0 ops/sec | ±0.00% | 0 samples |
| new:glob | FAIL | 0 ops/sec | ±0.00% | 0 samples |
| getInstance | FAIL | 0 ops/sec | ±0.00% | 0 samples |
| getInstance:glob | FAIL | 0 ops/sec | ±0.00% | 0 samples |
| reuse | FAIL | 0 ops/sec | ±0.00% | 0 samples |
| reuse:glob | FAIL | 0 ops/sec | ±0.00% | 0 samples |

## parsePolicyStatement Benchmarks

| Test Name | Pass/Fail | ops/sec | variance | samples (n) |
| --------- | --------- | ------- | -------- | ----------- |
| single | PASS | 16,146,627.242 ops/sec | ±0.37% | 97 samples |
| multiple | PASS | 13,307,723.454 ops/sec | ±0.38% | 94 samples |
| glob | PASS | 26,753,261.214 ops/sec | ±0.81% | 93 samples |
| regex | PASS | 2,932,377.783 ops/sec | ±0.57% | 98 samples |
