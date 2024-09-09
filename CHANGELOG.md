# Changelog

## [3.0.2](https://github.com/freakyfelt/could-could/compare/v3.0.1...v3.0.2) (2024-09-09)


### Bug Fixes

* **deps:** bump ajv from 8.16.0 to 8.17.1 ([#453](https://github.com/freakyfelt/could-could/issues/453)) ([3e9f8ae](https://github.com/freakyfelt/could-could/commit/3e9f8ae91c439f17bfdf36139e898a666ff84bf0))
* **deps:** bump json-logic-js from 2.0.2 to 2.0.5 ([#452](https://github.com/freakyfelt/could-could/issues/452)) ([5d36bca](https://github.com/freakyfelt/could-could/commit/5d36bcac5eefad003736dd062c6a57d82032ab5b))
* **deps:** bump lru-cache from 10.2.2 to 10.3.0 ([#441](https://github.com/freakyfelt/could-could/issues/441)) ([0cba53d](https://github.com/freakyfelt/could-could/commit/0cba53d596db24fd8a2ce9336e7767ad591d8cbb))
* **deps:** bump lru-cache from 10.3.0 to 10.4.0 ([#447](https://github.com/freakyfelt/could-could/issues/447)) ([f1195d6](https://github.com/freakyfelt/could-could/commit/f1195d677b3c6a76fad7bfbefcb3e9cb08179cae))
* **deps:** bump lru-cache from 10.4.0 to 11.0.0 ([#450](https://github.com/freakyfelt/could-could/issues/450)) ([0509e0f](https://github.com/freakyfelt/could-could/commit/0509e0f741d61e10dbab6bfb95a93d484d70a656))
* **deps:** bump lru-cache from 11.0.0 to 11.0.1 ([#502](https://github.com/freakyfelt/could-could/issues/502)) ([271a404](https://github.com/freakyfelt/could-could/commit/271a4042186a3548e6826ed03f6353915a2e7251))

## [3.0.1](https://github.com/freakyfelt/could-could/compare/v3.0.0...v3.0.1) (2024-06-08)


### Bug Fixes

* **deps:** bump ajv from 8.14.0 to 8.15.0 ([#415](https://github.com/freakyfelt/could-could/issues/415)) ([0b12a35](https://github.com/freakyfelt/could-could/commit/0b12a35417005516ed57ae73c0b04a014a420b13))
* **deps:** bump ajv from 8.15.0 to 8.16.0 ([#418](https://github.com/freakyfelt/could-could/issues/418)) ([ebf56e7](https://github.com/freakyfelt/could-could/commit/ebf56e735b4d40560991428e6a806b886c7f3ba9))

## [3.0.0](https://github.com/freakyfelt/could-could/compare/could-could-v2.1.0...could-could-v3.0.0) (2024-05-24)


### ⚠ BREAKING CHANGES

* move to ESM; drop Node 16.x support ([#393](https://github.com/freakyfelt/could-could/issues/393))

### Features

* move to ESM; drop Node 16.x support ([#393](https://github.com/freakyfelt/could-could/issues/393)) ([b0556b4](https://github.com/freakyfelt/could-could/commit/b0556b456419272b221fc2f8acaaf6437d615d80))

## [2.1.0](https://github.com/freakyfelt/could-could/compare/v2.0.0...v2.1.0) (2023-03-08)


### Features

* trigger a ci workflow ([ca3ebb6](https://github.com/freakyfelt/could-could/commit/ca3ebb61f2f87afd4abed4fe8b32d2158cceaeb8))

## [2.0.0](https://github.com/freakyfelt/could-could/compare/v1.0.0...v2.0.0) (2023-03-08)


### Bug Fixes

* **resolver:** return false if a deny statement is missing context ([7efaa56](https://github.com/freakyfelt/could-could/commit/7efaa56dc01e0cd35d540a6aabeb3e42f74bc880))


* feat!: rewrite to simpler interface ([f3a11b3](https://github.com/freakyfelt/could-could/commit/f3a11b35cca652c4896095741b073d013c0e9bc8))


### Features

* **policy-resolver:** use an LRU cache instead of a map ([2c573b1](https://github.com/freakyfelt/could-could/commit/2c573b1c5c7de0c3582efcacb1304bf6f57785a0))
* **store:** add concept of policy statement groups ([#71](https://github.com/freakyfelt/could-could/issues/71)) ([c93708f](https://github.com/freakyfelt/could-could/commit/c93708ff74245713e86d198f356a1ce2fbd585d6))
* trigger ci ([6c141ff](https://github.com/freakyfelt/could-could/commit/6c141ff784fa77ce8b00cfa7fe80753b59b3625e))
* use an event emitter to invalidate caches ([6ab9059](https://github.com/freakyfelt/could-could/commit/6ab9059d4fba7942cb3ebe105d533cde6bdf2ae1))


### BREAKING CHANGES

* the 2.x interface drops environments and resource types

## [2.0.0](https://github.com/freakyfelt/could-could/compare/v1.0.0...v2.0.0) (2023-03-08)


### Bug Fixes

* **resolver:** return false if a deny statement is missing context ([7efaa56](https://github.com/freakyfelt/could-could/commit/7efaa56dc01e0cd35d540a6aabeb3e42f74bc880))


* feat!: rewrite to simpler interface ([f3a11b3](https://github.com/freakyfelt/could-could/commit/f3a11b35cca652c4896095741b073d013c0e9bc8))


### Features

* **policy-resolver:** use an LRU cache instead of a map ([2c573b1](https://github.com/freakyfelt/could-could/commit/2c573b1c5c7de0c3582efcacb1304bf6f57785a0))
* **store:** add concept of policy statement groups ([#71](https://github.com/freakyfelt/could-could/issues/71)) ([c93708f](https://github.com/freakyfelt/could-could/commit/c93708ff74245713e86d198f356a1ce2fbd585d6))
* use an event emitter to invalidate caches ([6ab9059](https://github.com/freakyfelt/could-could/commit/6ab9059d4fba7942cb3ebe105d533cde6bdf2ae1))


### BREAKING CHANGES

* the 2.x interface drops environments and resource types

## [2.0.0](https://github.com/freakyfelt/could-could/compare/v1.0.0...v2.0.0) (2023-03-08)


### Bug Fixes

* **resolver:** return false if a deny statement is missing context ([7efaa56](https://github.com/freakyfelt/could-could/commit/7efaa56dc01e0cd35d540a6aabeb3e42f74bc880))


* feat!: rewrite to simpler interface ([f3a11b3](https://github.com/freakyfelt/could-could/commit/f3a11b35cca652c4896095741b073d013c0e9bc8))


### Features

* **policy-resolver:** use an LRU cache instead of a map ([2c573b1](https://github.com/freakyfelt/could-could/commit/2c573b1c5c7de0c3582efcacb1304bf6f57785a0))
* **store:** add concept of policy statement groups ([#71](https://github.com/freakyfelt/could-could/issues/71)) ([c93708f](https://github.com/freakyfelt/could-could/commit/c93708ff74245713e86d198f356a1ce2fbd585d6))
* use an event emitter to invalidate caches ([6ab9059](https://github.com/freakyfelt/could-could/commit/6ab9059d4fba7942cb3ebe105d533cde6bdf2ae1))


### BREAKING CHANGES

* the 2.x interface drops environments and resource types
