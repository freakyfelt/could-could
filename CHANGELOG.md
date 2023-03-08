# [2.0.0](https://github.com/freakyfelt/could-could/compare/v1.0.0...v2.0.0) (2023-03-08)


### Bug Fixes

* **resolver:** return false if a deny statement is missing context ([7efaa56](https://github.com/freakyfelt/could-could/commit/7efaa56dc01e0cd35d540a6aabeb3e42f74bc880))


* feat!: rewrite to simpler interface ([f3a11b3](https://github.com/freakyfelt/could-could/commit/f3a11b35cca652c4896095741b073d013c0e9bc8))


### Features

* **policy-resolver:** use an LRU cache instead of a map ([2c573b1](https://github.com/freakyfelt/could-could/commit/2c573b1c5c7de0c3582efcacb1304bf6f57785a0))
* **store:** add concept of policy statement groups ([#71](https://github.com/freakyfelt/could-could/issues/71)) ([c93708f](https://github.com/freakyfelt/could-could/commit/c93708ff74245713e86d198f356a1ce2fbd585d6))
* use an event emitter to invalidate caches ([6ab9059](https://github.com/freakyfelt/could-could/commit/6ab9059d4fba7942cb3ebe105d533cde6bdf2ae1))


### BREAKING CHANGES

* the 2.x interface drops environments and resource types
