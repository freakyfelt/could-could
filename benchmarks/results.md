# could-could performance

Performed on: 2023-03-15T01:24:20.614Z

## PolicyResolver Benchmarks

| Test Name                               | Pass/Fail | ops/sec               | variance | samples (n) |
| --------------------------------------- | --------- | --------------------- | -------- | ----------- |
| globAll:new:uncached:ctx:allow          | PASS      | 78,252.612 ops/sec    | ±4.29%   | 78 samples  |
| globAll:new:cached:ctx:allow            | PASS      | 84,341.614 ops/sec    | ±3.25%   | 80 samples  |
| globAll:instance:uncached:ctx:deny      | PASS      | 666,500.425 ops/sec   | ±0.42%   | 92 samples  |
| globAll:instance:cached:ctx:deny        | PASS      | 660,777.005 ops/sec   | ±0.64%   | 91 samples  |
| globStart:new:uncached:ctx:allow        | PASS      | 61,229.161 ops/sec    | ±4.41%   | 73 samples  |
| globStart:new:cached:ctx:allow          | PASS      | 63,743.44 ops/sec     | ±3.51%   | 84 samples  |
| globStart:new:uncached:ctx:deny         | PASS      | 74,101.69 ops/sec     | ±4.22%   | 75 samples  |
| globStart:new:cached:ctx:deny           | PASS      | 79,977.618 ops/sec    | ±3.99%   | 80 samples  |
| globStart:new:uncached:noctx:allow      | PASS      | 98,369.061 ops/sec    | ±5.42%   | 69 samples  |
| globStart:new:cached:noctx:allow        | PASS      | 107,343.286 ops/sec   | ±4.95%   | 71 samples  |
| globStart:instance:uncached:ctx:allow   | PASS      | 184,823.732 ops/sec   | ±0.97%   | 92 samples  |
| globStart:instance:cached:ctx:allow     | PASS      | 182,590.716 ops/sec   | ±1.71%   | 92 samples  |
| globStart:instance:uncached:ctx:deny    | PASS      | 337,293.314 ops/sec   | ±3.51%   | 87 samples  |
| globStart:instance:cached:ctx:deny      | PASS      | 349,905.016 ops/sec   | ±3.28%   | 90 samples  |
| globStart:instance:uncached:noctx:allow | PASS      | 6,196,766.518 ops/sec | ±0.57%   | 94 samples  |
| globStart:instance:cached:noctx:allow   | PASS      | 6,155,105.908 ops/sec | ±0.93%   | 96 samples  |
| exact:new:uncached:ctx:allow            | PASS      | 59,199.734 ops/sec    | ±4.10%   | 83 samples  |
| exact:new:cached:ctx:allow              | PASS      | 62,288.66 ops/sec     | ±4.00%   | 82 samples  |
| exact:new:uncached:ctx:deny             | PASS      | 75,681.271 ops/sec    | ±3.60%   | 82 samples  |
| exact:new:cached:ctx:deny               | PASS      | 79,861.569 ops/sec    | ±3.13%   | 84 samples  |
| exact:new:uncached:noctx:allow          | PASS      | 97,918.749 ops/sec    | ±4.99%   | 59 samples  |
| exact:new:cached:noctx:allow            | PASS      | 106,864.059 ops/sec   | ±4.19%   | 68 samples  |
| exact:instance:uncached:ctx:allow       | PASS      | 184,679.161 ops/sec   | ±2.02%   | 93 samples  |
| exact:instance:cached:ctx:allow         | PASS      | 180,868.577 ops/sec   | ±3.67%   | 90 samples  |
| exact:instance:uncached:ctx:deny        | PASS      | 348,250.508 ops/sec   | ±2.33%   | 92 samples  |
| exact:instance:cached:ctx:deny          | PASS      | 327,895.949 ops/sec   | ±6.75%   | 86 samples  |
| exact:instance:uncached:noctx:allow     | PASS      | 6,076,297.092 ops/sec | ±1.47%   | 89 samples  |
| exact:instance:cached:noctx:allow       | PASS      | 6,162,365.859 ops/sec | ±0.88%   | 93 samples  |

## PolicyDocumentValidator Benchmarks

| Test Name        | Pass/Fail | ops/sec               | variance | samples (n) |
| ---------------- | --------- | --------------------- | -------- | ----------- |
| new              | PASS      | 118.693 ops/sec       | ±2.94%   | 76 samples  |
| new:glob         | PASS      | 131.115 ops/sec       | ±1.55%   | 79 samples  |
| getInstance      | PASS      | 219,757.349 ops/sec   | ±0.59%   | 94 samples  |
| getInstance:glob | PASS      | 2,418,934.16 ops/sec  | ±3.10%   | 87 samples  |
| reuse            | PASS      | 222,149.334 ops/sec   | ±1.93%   | 91 samples  |
| reuse:glob       | PASS      | 2,756,992.806 ops/sec | ±4.15%   | 89 samples  |

## parsePolicyStatement Benchmarks

| Test Name | Pass/Fail | ops/sec                | variance | samples (n) |
| --------- | --------- | ---------------------- | -------- | ----------- |
| single    | PASS      | 7,301,188.489 ops/sec  | ±3.67%   | 89 samples  |
| multiple  | PASS      | 6,102,120.598 ops/sec  | ±3.18%   | 88 samples  |
| glob      | PASS      | 11,102,538.088 ops/sec | ±2.99%   | 88 samples  |
| regex     | PASS      | 1,096,113.707 ops/sec  | ±3.44%   | 92 samples  |
