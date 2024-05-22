# could-could performance

Performed on: Tue May 21 2024

Node version: v18.20.3
Platform/Architecture: darwin/arm64

## PolicyResolver Benchmarks

| Test Name | Pass/Fail | ops/sec | variance | samples (n) |
| --------- | --------- | ------- | -------- | ----------- |
| globAll:new:uncached:ctx:allow | PASS | 221,995.261 ops/sec | ±1.44% | 88 samples |
| globAll:new:cached:ctx:allow | PASS | 227,358.726 ops/sec | ±1.47% | 89 samples |
| globAll:instance:uncached:ctx:deny | PASS | 1,775,213.305 ops/sec | ±0.17% | 101 samples |
| globAll:instance:cached:ctx:deny | PASS | 1,785,473.205 ops/sec | ±0.10% | 101 samples |
| globStart:new:uncached:ctx:allow | PASS | 184,047.8 ops/sec | ±0.92% | 94 samples |
| globStart:new:cached:ctx:allow | PASS | 188,287.008 ops/sec | ±0.84% | 92 samples |
| globStart:new:uncached:ctx:deny | PASS | 226,179.596 ops/sec | ±0.75% | 91 samples |
| globStart:new:cached:ctx:deny | PASS | 234,748.535 ops/sec | ±0.77% | 92 samples |
| globStart:new:uncached:noctx:allow | PASS | 308,131.673 ops/sec | ±1.46% | 91 samples |
| globStart:new:cached:noctx:allow | PASS | 326,557.043 ops/sec | ±1.00% | 93 samples |
| globStart:instance:uncached:ctx:allow | PASS | 473,234.682 ops/sec | ±0.13% | 94 samples |
| globStart:instance:cached:ctx:allow | PASS | 470,377.16 ops/sec | ±0.28% | 96 samples |
| globStart:instance:uncached:ctx:deny | PASS | 890,055.58 ops/sec | ±0.43% | 95 samples |
| globStart:instance:cached:ctx:deny | PASS | 914,060.697 ops/sec | ±0.16% | 100 samples |
| globStart:instance:uncached:noctx:allow | PASS | 11,305,477.395 ops/sec | ±1.56% | 96 samples |
| globStart:instance:cached:noctx:allow | PASS | 11,323,835.775 ops/sec | ±1.33% | 98 samples |
| exact:new:uncached:ctx:allow | PASS | 180,006.897 ops/sec | ±1.00% | 93 samples |
| exact:new:cached:ctx:allow | PASS | 185,633.683 ops/sec | ±0.98% | 91 samples |
| exact:new:uncached:ctx:deny | PASS | 221,323.028 ops/sec | ±0.83% | 91 samples |
| exact:new:cached:ctx:deny | PASS | 231,102.935 ops/sec | ±0.77% | 90 samples |
| exact:new:uncached:noctx:allow | PASS | 311,868.661 ops/sec | ±0.75% | 91 samples |
| exact:new:cached:noctx:allow | PASS | 320,718.127 ops/sec | ±0.82% | 91 samples |
| exact:instance:uncached:ctx:allow | PASS | 475,819.535 ops/sec | ±0.11% | 101 samples |
| exact:instance:cached:ctx:allow | PASS | 477,862.325 ops/sec | ±0.09% | 102 samples |
| exact:instance:uncached:ctx:deny | PASS | 913,911.153 ops/sec | ±0.10% | 100 samples |
| exact:instance:cached:ctx:deny | PASS | 913,518.19 ops/sec | ±0.13% | 100 samples |
| exact:instance:uncached:noctx:allow | PASS | 11,285,403.062 ops/sec | ±1.54% | 96 samples |
| exact:instance:cached:noctx:allow | PASS | 11,143,168.047 ops/sec | ±0.73% | 99 samples |

## PolicyDocumentValidator Benchmarks

| Test Name | Pass/Fail | ops/sec | variance | samples (n) |
| --------- | --------- | ------- | -------- | ----------- |
| new | PASS | 458.683 ops/sec | ±0.85% | 95 samples |
| new:glob | PASS | 471.335 ops/sec | ±0.45% | 93 samples |
| getInstance | PASS | 633,690.686 ops/sec | ±0.15% | 100 samples |
| getInstance:glob | PASS | 7,139,705.793 ops/sec | ±0.14% | 97 samples |
| reuse | PASS | 651,603.1 ops/sec | ±0.11% | 102 samples |
| reuse:glob | PASS | 7,923,267.432 ops/sec | ±0.17% | 95 samples |

## parsePolicyStatement Benchmarks

| Test Name | Pass/Fail | ops/sec | variance | samples (n) |
| --------- | --------- | ------- | -------- | ----------- |
| single | PASS | 16,385,095.252 ops/sec | ±0.26% | 100 samples |
| multiple | PASS | 13,693,743.186 ops/sec | ±0.35% | 95 samples |
| glob | PASS | 27,931,013.283 ops/sec | ±0.23% | 98 samples |
| regex | PASS | 2,958,610.099 ops/sec | ±0.61% | 96 samples |
