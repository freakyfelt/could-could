# could-could performance

Performed on: Tue May 21 2024

Node version: v20.12.2
Platform/Architecture: darwin/arm64

## PolicyResolver Benchmarks

| Test Name | Pass/Fail | ops/sec | variance | samples (n) |
| --------- | --------- | ------- | -------- | ----------- |
| globAll:new:uncached:ctx:allow | PASS | 377,957.322 ops/sec | ±0.21% | 95 samples |
| globAll:new:cached:ctx:allow | PASS | 395,191.764 ops/sec | ±0.19% | 96 samples |
| globAll:instance:uncached:ctx:deny | PASS | 2,073,325.264 ops/sec | ±0.18% | 100 samples |
| globAll:instance:cached:ctx:deny | PASS | 2,053,311.602 ops/sec | ±0.15% | 99 samples |
| globStart:new:uncached:ctx:allow | PASS | 272,972.469 ops/sec | ±0.12% | 100 samples |
| globStart:new:cached:ctx:allow | PASS | 285,783.376 ops/sec | ±0.20% | 102 samples |
| globStart:new:uncached:ctx:deny | PASS | 367,638.211 ops/sec | ±0.14% | 100 samples |
| globStart:new:cached:ctx:deny | PASS | 389,738.979 ops/sec | ±0.23% | 96 samples |
| globStart:new:uncached:noctx:allow | PASS | 567,178.046 ops/sec | ±0.65% | 93 samples |
| globStart:new:cached:noctx:allow | PASS | 609,382.161 ops/sec | ±0.51% | 96 samples |
| globStart:instance:uncached:ctx:allow | PASS | 511,687.007 ops/sec | ±0.50% | 100 samples |
| globStart:instance:cached:ctx:allow | PASS | 518,035.77 ops/sec | ±0.23% | 94 samples |
| globStart:instance:uncached:ctx:deny | PASS | 1,033,406.199 ops/sec | ±0.29% | 93 samples |
| globStart:instance:cached:ctx:deny | PASS | 1,035,170.917 ops/sec | ±0.21% | 101 samples |
| globStart:instance:uncached:noctx:allow | PASS | 26,262,649.789 ops/sec | ±0.30% | 98 samples |
| globStart:instance:cached:noctx:allow | PASS | 28,299,641.361 ops/sec | ±0.58% | 99 samples |
| exact:new:uncached:ctx:allow | PASS | 268,255.879 ops/sec | ±0.21% | 98 samples |
| exact:new:cached:ctx:allow | PASS | 280,607.282 ops/sec | ±0.40% | 95 samples |
| exact:new:uncached:ctx:deny | PASS | 360,958.252 ops/sec | ±0.22% | 101 samples |
| exact:new:cached:ctx:deny | PASS | 384,227.956 ops/sec | ±0.18% | 98 samples |
| exact:new:uncached:noctx:allow | PASS | 566,359.893 ops/sec | ±0.43% | 97 samples |
| exact:new:cached:noctx:allow | PASS | 598,700.269 ops/sec | ±0.54% | 95 samples |
| exact:instance:uncached:ctx:allow | PASS | 515,148.794 ops/sec | ±0.36% | 100 samples |
| exact:instance:cached:ctx:allow | PASS | 516,762.903 ops/sec | ±0.35% | 98 samples |
| exact:instance:uncached:ctx:deny | PASS | 1,028,596.301 ops/sec | ±0.21% | 96 samples |
| exact:instance:cached:ctx:deny | PASS | 1,031,449.444 ops/sec | ±0.25% | 99 samples |
| exact:instance:uncached:noctx:allow | PASS | 28,174,988.938 ops/sec | ±0.89% | 95 samples |
| exact:instance:cached:noctx:allow | PASS | 28,417,978.32 ops/sec | ±0.22% | 98 samples |

## PolicyDocumentValidator Benchmarks

| Test Name | Pass/Fail | ops/sec | variance | samples (n) |
| --------- | --------- | ------- | -------- | ----------- |
| new | PASS | 458.78 ops/sec | ±0.80% | 94 samples |
| new:glob | PASS | 454.211 ops/sec | ±1.17% | 89 samples |
| getInstance | PASS | 696,991.616 ops/sec | ±0.22% | 101 samples |
| getInstance:glob | PASS | 7,973,198.177 ops/sec | ±0.94% | 95 samples |
| reuse | PASS | 707,386.955 ops/sec | ±0.65% | 97 samples |
| reuse:glob | PASS | 8,554,128.721 ops/sec | ±0.59% | 92 samples |

## parsePolicyStatement Benchmarks

| Test Name | Pass/Fail | ops/sec | variance | samples (n) |
| --------- | --------- | ------- | -------- | ----------- |
| single | PASS | 17,905,358.195 ops/sec | ±0.36% | 96 samples |
| multiple | PASS | 15,119,110.363 ops/sec | ±0.88% | 99 samples |
| glob | PASS | 28,698,364.571 ops/sec | ±1.15% | 100 samples |
| regex | PASS | 3,021,340.42 ops/sec | ±0.25% | 99 samples |
