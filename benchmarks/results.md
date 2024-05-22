# could-could performance

Performed on: Tue May 21 2024

Node version: v18.20.3
Platform/Architecture: darwin/arm64

## PolicyResolver Benchmarks

| Test Name | Pass/Fail | ops/sec | variance | samples (n) |
| --------- | --------- | ------- | -------- | ----------- |
| globAll:new:uncached:ctx:allow | PASS | 362,925.934 ops/sec | ±0.21% | 100 samples |
| globAll:new:cached:ctx:allow | PASS | 376,702.321 ops/sec | ±0.31% | 96 samples |
| globAll:instance:uncached:ctx:deny | PASS | 2,016,321.415 ops/sec | ±0.19% | 99 samples |
| globAll:instance:cached:ctx:deny | PASS | 2,004,663.006 ops/sec | ±0.24% | 99 samples |
| globStart:new:uncached:ctx:allow | PASS | 233,924.435 ops/sec | ±0.53% | 100 samples |
| globStart:new:cached:ctx:allow | PASS | 243,196.975 ops/sec | ±0.44% | 98 samples |
| globStart:new:uncached:ctx:deny | PASS | 344,706.944 ops/sec | ±0.30% | 94 samples |
| globStart:new:cached:ctx:deny | PASS | 373,141.85 ops/sec | ±0.20% | 100 samples |
| globStart:new:uncached:noctx:allow | PASS | 535,972.458 ops/sec | ±0.44% | 98 samples |
| globStart:new:cached:noctx:allow | PASS | 572,992.559 ops/sec | ±0.49% | 96 samples |
| globStart:instance:uncached:ctx:allow | PASS | 423,880.822 ops/sec | ±0.19% | 99 samples |
| globStart:instance:cached:ctx:allow | PASS | 423,524.07 ops/sec | ±0.17% | 98 samples |
| globStart:instance:uncached:ctx:deny | PASS | 993,611.273 ops/sec | ±0.13% | 94 samples |
| globStart:instance:cached:ctx:deny | PASS | 991,394.895 ops/sec | ±0.12% | 101 samples |
| globStart:instance:uncached:noctx:allow | PASS | 31,070,223.901 ops/sec | ±0.22% | 100 samples |
| globStart:instance:cached:noctx:allow | PASS | 31,199,840.323 ops/sec | ±0.18% | 100 samples |
| exact:new:uncached:ctx:allow | PASS | 236,052.54 ops/sec | ±0.16% | 100 samples |
| exact:new:cached:ctx:allow | PASS | 241,620.637 ops/sec | ±0.75% | 98 samples |
| exact:new:uncached:ctx:deny | PASS | 342,903.584 ops/sec | ±0.28% | 99 samples |
| exact:new:cached:ctx:deny | PASS | 371,754.785 ops/sec | ±0.22% | 100 samples |
| exact:new:uncached:noctx:allow | PASS | 532,908.853 ops/sec | ±0.53% | 96 samples |
| exact:new:cached:noctx:allow | PASS | 570,512.541 ops/sec | ±0.49% | 94 samples |
| exact:instance:uncached:ctx:allow | PASS | 424,206.572 ops/sec | ±0.15% | 98 samples |
| exact:instance:cached:ctx:allow | PASS | 421,857.159 ops/sec | ±0.21% | 98 samples |
| exact:instance:uncached:ctx:deny | PASS | 981,045.223 ops/sec | ±0.22% | 96 samples |
| exact:instance:cached:ctx:deny | PASS | 973,648.547 ops/sec | ±0.47% | 98 samples |
| exact:instance:uncached:noctx:allow | PASS | 28,318,343.335 ops/sec | ±0.56% | 95 samples |
| exact:instance:cached:noctx:allow | PASS | 31,088,744.991 ops/sec | ±0.23% | 98 samples |

## PolicyDocumentValidator Benchmarks

| Test Name | Pass/Fail | ops/sec | variance | samples (n) |
| --------- | --------- | ------- | -------- | ----------- |
| new | PASS | 442.539 ops/sec | ±1.16% | 90 samples |
| new:glob | PASS | 452.529 ops/sec | ±0.71% | 94 samples |
| getInstance | PASS | 639,769.339 ops/sec | ±0.21% | 101 samples |
| getInstance:glob | PASS | 7,334,000.748 ops/sec | ±0.17% | 99 samples |
| reuse | PASS | 646,806.572 ops/sec | ±0.44% | 99 samples |
| reuse:glob | PASS | 8,063,421.861 ops/sec | ±0.17% | 98 samples |

## parsePolicyStatement Benchmarks

| Test Name | Pass/Fail | ops/sec | variance | samples (n) |
| --------- | --------- | ------- | -------- | ----------- |
| single | PASS | 16,170,574.995 ops/sec | ±0.62% | 96 samples |
| multiple | PASS | 13,436,455.299 ops/sec | ±0.35% | 97 samples |
| glob | PASS | 26,807,029.672 ops/sec | ±0.55% | 95 samples |
| regex | PASS | 2,980,691.203 ops/sec | ±0.27% | 100 samples |
