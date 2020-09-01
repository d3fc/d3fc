# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [3.1.0](https://github.com/d3fc/d3fc/compare/@d3fc/d3fc-webgl@3.0.0...@d3fc/d3fc-webgl@3.1.0) (2020-09-01)


### Features

* reepoch scaleTime values using Date.now ([2aa8d9b](https://github.com/d3fc/d3fc/commit/2aa8d9b))





# [3.0.0](https://github.com/d3fc/d3fc/compare/@d3fc/d3fc-webgl@2.0.2...@d3fc/d3fc-webgl@3.0.0) (2020-08-14)


### Bug Fixes

* incorrect candlestick/ohlc width ([484d502](https://github.com/d3fc/d3fc/commit/484d502))


### Features

* add pixelRatio property to webgl series ([08c2de1](https://github.com/d3fc/d3fc/commit/08c2de1))


### BREAKING CHANGES

* webgl series must now expose a pixelRatio property





## [2.0.2](https://github.com/d3fc/d3fc/compare/@d3fc/d3fc-webgl@2.0.1...@d3fc/d3fc-webgl@2.0.2) (2020-07-14)

**Note:** Version bump only for package @d3fc/d3fc-webgl





## 2.0.1 (2020-06-12)

**Note:** Version bump only for package @d3fc/d3fc-webgl





# 2.0.0 (2020-04-16)


### chore

* consolidate dependencies ([79b7d1f](https://github.com/d3fc/d3fc/commit/79b7d1f))


### Features

* divisor defaults to null (auto) ([e60c82e](https://github.com/d3fc/d3fc/commit/e60c82e))


### BREAKING CHANGES

* d3fc no longer has a direct dependency on d3. Add the
dependency directly to your package instead.





## [1.9.2](https://github.com/d3fc/d3fc/compare/@d3fc/d3fc-webgl@1.9.1...@d3fc/d3fc-webgl@1.9.2) (2020-04-02)


### Bug Fixes

* move webgl style decorator dirty check ([208d787](https://github.com/d3fc/d3fc/commit/208d787))
* stale divisor values if using non-instanced series ([a4418c5](https://github.com/d3fc/d3fc/commit/a4418c5))





## [1.9.1](https://github.com/d3fc/d3fc/compare/@d3fc/d3fc-webgl@1.9.0...@d3fc/d3fc-webgl@1.9.1) (2020-03-26)

**Note:** Version bump only for package @d3fc/d3fc-webgl





# [1.9.0](https://github.com/d3fc/d3fc/compare/@d3fc/d3fc-webgl@1.8.2...@d3fc/d3fc-webgl@1.9.0) (2020-03-25)


### Features

* add webgl star symbol ([c5124dd](https://github.com/d3fc/d3fc/commit/c5124dd))
* add webgl wye symbol ([267ba37](https://github.com/d3fc/d3fc/commit/267ba37))





## [1.8.2](https://github.com/d3fc/d3fc/compare/@d3fc/d3fc-webgl@1.8.1...@d3fc/d3fc-webgl@1.8.2) (2020-03-25)

**Note:** Version bump only for package @d3fc/d3fc-webgl





## [1.8.1](https://github.com/d3fc/d3fc/compare/@d3fc/d3fc-webgl@1.8.0...@d3fc/d3fc-webgl@1.8.1) (2020-03-24)

**Note:** Version bump only for package @d3fc/d3fc-webgl





# [1.8.0](https://github.com/d3fc/d3fc/compare/@d3fc/d3fc-webgl@1.7.1...@d3fc/d3fc-webgl@1.8.0) (2020-03-19)


### Bug Fixes

* remove broken webgl boxplot fill ([1a16f57](https://github.com/d3fc/d3fc/commit/1a16f57))
* update imports to fix standalone package use ([cbb810e](https://github.com/d3fc/d3fc/commit/cbb810e))
* webgl bar colour ([98679ff](https://github.com/d3fc/d3fc/commit/98679ff))


### Features

* add debug property to opt-in to error checks ([c1aeccb](https://github.com/d3fc/d3fc/commit/c1aeccb))
* add debug property to opt-in to error checks ([1c97ec6](https://github.com/d3fc/d3fc/commit/1c97ec6))
* add fill to webgl boxplot ([7ea7859](https://github.com/d3fc/d3fc/commit/7ea7859))
* add fill/stroke functionality for components ([d546aa6](https://github.com/d3fc/d3fc/commit/d546aa6))
* add handling for context lost ([2f4b391](https://github.com/d3fc/d3fc/commit/2f4b391))
* add webgl diamond symbol ([#1481](https://github.com/d3fc/d3fc/issues/1481)) ([7605bb2](https://github.com/d3fc/d3fc/commit/7605bb2))





## [1.7.1](https://github.com/d3fc/d3fc/compare/@d3fc/d3fc-webgl@1.7.0...@d3fc/d3fc-webgl@1.7.1) (2020-02-18)

**Note:** Version bump only for package @d3fc/d3fc-webgl





# [1.7.0](https://github.com/d3fc/d3fc/compare/@d3fc/d3fc-webgl@1.6.0...@d3fc/d3fc-webgl@1.7.0) (2020-02-18)


### Bug Fixes

* always use instanced rendering to fix fill/stroke ([4f2f5cd](https://github.com/d3fc/d3fc/commit/4f2f5cd))


### Features

* add fill/strokeColor decorators ([aacaacd](https://github.com/d3fc/d3fc/commit/aacaacd))
* add slidingWindowElementConstantAttributeBuilder ([2f15863](https://github.com/d3fc/d3fc/commit/2f15863))
* add useful error messages to bufferBuilder ([9f043f2](https://github.com/d3fc/d3fc/commit/9f043f2))
* support initialValue for constantAttribute ([890d3a2](https://github.com/d3fc/d3fc/commit/890d3a2))





# [1.6.0](https://github.com/d3fc/d3fc/compare/@d3fc/d3fc-webgl@1.5.7...@d3fc/d3fc-webgl@1.6.0) (2020-02-06)


### Features

* allow multiple components with elementConstantAttributeBuilder ([91051b2](https://github.com/d3fc/d3fc/commit/91051b2))





## [1.5.7](https://github.com/d3fc/d3fc/compare/@d3fc/d3fc-webgl@1.5.6...@d3fc/d3fc-webgl@1.5.7) (2020-02-06)

**Note:** Version bump only for package @d3fc/d3fc-webgl





## [1.5.6](https://github.com/d3fc/d3fc/compare/@d3fc/d3fc-webgl@1.5.5...@d3fc/d3fc-webgl@1.5.6) (2020-02-05)

**Note:** Version bump only for package @d3fc/d3fc-webgl





## [1.5.5](https://github.com/d3fc/d3fc/compare/@d3fc/d3fc-webgl@1.5.4...@d3fc/d3fc-webgl@1.5.5) (2020-02-05)

**Note:** Version bump only for package @d3fc/d3fc-webgl





## [1.5.4](https://github.com/d3fc/d3fc/compare/@d3fc/d3fc-webgl@1.5.3...@d3fc/d3fc-webgl@1.5.4) (2020-02-04)

**Note:** Version bump only for package @d3fc/d3fc-webgl





## [1.5.3](https://github.com/d3fc/d3fc/compare/@d3fc/d3fc-webgl@1.5.2...@d3fc/d3fc-webgl@1.5.3) (2020-01-31)

**Note:** Version bump only for package @d3fc/d3fc-webgl





## [1.5.2](https://github.com/d3fc/d3fc/compare/@d3fc/d3fc-webgl@1.5.1...@d3fc/d3fc-webgl@1.5.2) (2020-01-31)

**Note:** Version bump only for package @d3fc/d3fc-webgl





## [1.5.1](https://github.com/d3fc/d3fc/compare/@d3fc/d3fc-webgl@1.5.0...@d3fc/d3fc-webgl@1.5.1) (2020-01-31)

**Note:** Version bump only for package @d3fc/d3fc-webgl





# [1.5.0](https://github.com/d3fc/d3fc/compare/@d3fc/d3fc-webgl@1.4.2...@d3fc/d3fc-webgl@1.5.0) (2020-01-31)


### Features

* add drawArraysInstanced ([87add6c](https://github.com/d3fc/d3fc/commit/87add6c))





## [1.4.2](https://github.com/d3fc/d3fc/compare/@d3fc/d3fc-webgl@1.4.1...@d3fc/d3fc-webgl@1.4.2) (2020-01-31)

**Note:** Version bump only for package @d3fc/d3fc-webgl





## [1.4.1](https://github.com/d3fc/d3fc/compare/@d3fc/d3fc-webgl@1.4.0...@d3fc/d3fc-webgl@1.4.1) (2020-01-28)


### Bug Fixes

* added decorate function to errorbar ([887e34a](https://github.com/d3fc/d3fc/commit/887e34a))





# [1.4.0](https://github.com/d3fc/d3fc/compare/@d3fc/d3fc-webgl@1.3.5...@d3fc/d3fc-webgl@1.4.0) (2020-01-27)


### Features

* added vertexConstantAttributeBuilder ([36e920c](https://github.com/d3fc/d3fc/commit/36e920c))





## [1.3.5](https://github.com/d3fc/d3fc/compare/@d3fc/d3fc-webgl@1.3.4...@d3fc/d3fc-webgl@1.3.5) (2020-01-27)


### Bug Fixes

* typo in boxplot code ([a0e8152](https://github.com/d3fc/d3fc/commit/a0e8152))





## [1.3.4](https://github.com/d3fc/d3fc/compare/@d3fc/d3fc-webgl@1.3.3...@d3fc/d3fc-webgl@1.3.4) (2020-01-27)

**Note:** Version bump only for package @d3fc/d3fc-webgl





## [1.3.3](https://github.com/d3fc/d3fc/compare/@d3fc/d3fc-webgl@1.3.2...@d3fc/d3fc-webgl@1.3.3) (2020-01-24)


### Bug Fixes

* call baseAttributeBuilder before dirty check ([ccd1b81](https://github.com/d3fc/d3fc/commit/ccd1b81))
* move dirty check to baseAttributeBuilder ([bba108b](https://github.com/d3fc/d3fc/commit/bba108b))





## [1.3.2](https://github.com/d3fc/d3fc/compare/@d3fc/d3fc-webgl@1.3.1...@d3fc/d3fc-webgl@1.3.2) (2020-01-22)

**Note:** Version bump only for package @d3fc/d3fc-webgl





## [1.3.1](https://github.com/d3fc/d3fc/compare/@d3fc/d3fc-webgl@1.3.0...@d3fc/d3fc-webgl@1.3.1) (2020-01-21)

**Note:** Version bump only for package @d3fc/d3fc-webgl





# [1.3.0](https://github.com/d3fc/d3fc/compare/@d3fc/d3fc-webgl@1.2.3...@d3fc/d3fc-webgl@1.3.0) (2020-01-21)


### Features

* add elementConstantAttributeBuilder for appropriate attributes ([ba51b0c](https://github.com/d3fc/d3fc/commit/ba51b0c))





## [1.2.3](https://github.com/d3fc/d3fc/compare/@d3fc/d3fc-webgl@1.2.2...@d3fc/d3fc-webgl@1.2.3) (2020-01-20)


### Bug Fixes

* separate candlestick and ohlc into separate shaders ([4d1f6f7](https://github.com/d3fc/d3fc/commit/4d1f6f7))





## [1.2.2](https://github.com/d3fc/d3fc/compare/@d3fc/d3fc-webgl@1.2.1...@d3fc/d3fc-webgl@1.2.2) (2020-01-20)

**Note:** Version bump only for package @d3fc/d3fc-webgl





## [1.2.1](https://github.com/d3fc/d3fc/compare/@d3fc/d3fc-webgl@1.2.0...@d3fc/d3fc-webgl@1.2.1) (2020-01-17)

**Note:** Version bump only for package @d3fc/d3fc-webgl





# [1.2.0](https://github.com/d3fc/d3fc/compare/@d3fc/d3fc-webgl@1.1.0...@d3fc/d3fc-webgl@1.2.0) (2020-01-16)


### Features

* add projectedAttributeBuilder ([583ded7](https://github.com/d3fc/d3fc/commit/583ded7))





# 1.1.0 (2020-01-03)


### Bug Fixes

* changes uniform to attribute for multicolor ([a09833f](https://github.com/d3fc/d3fc/commit/a09833f))
* updated examples to match refactored api ([e8fa257](https://github.com/d3fc/d3fc/commit/e8fa257))


### Features

* webgl series implementations ([233ed25](https://github.com/d3fc/d3fc/commit/233ed25))
