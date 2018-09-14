# d3fc [![Build Status](https://travis-ci.org/d3fc/d3fc.svg?branch=master)](https://travis-ci.org/d3fc/d3fc) [![Semver](http://img.shields.io/SemVer/2.0.0.png)](http://semver.org/spec/v2.0.0.html) [![npm version](https://badge.fury.io/js/d3fc.svg)](https://badge.fury.io/js/d3fc)

A collection of components that make it easy to build interactive charts with D3.

## Migration to D3 version 5

This project has recently upgraded to D3 version 5 to take advantage of the new promise-based API, and stays compatible with D3 version 4 for all other functionality. For more details, see the [release notes for D3 version 5.0](https://github.com/d3/d3/releases/tag/v5.0.0) and [d3fc v14.0.0](https://github.com/d3fc/d3fc/releases/tag/v14.0.0).

## Installation and Documentation

For details of installation and general usage, visit the [d3fc project webpage](http://d3fc.io/).

## Developing

This project is a mono-repo that uses [Lerna](https://lernajs.io/) to manage dependencies between packages. To get started, run the following:

~~~
npm install
npm test
~~~

This install dependencies, and runs `lerna bootstrap` in order to manage the cross-dependencies between the various projects. The test script bundles all of the packages and runs the tests.

When making changes to a package, you can either execute `npm run bundle` within the package folder to build just that package, or you can run the following from the project root:

~~~
npx lerna run bundle --since --concurrency 1
~~~

This uses `lerna run` to execute the `bundle` run script for all packages that have been modified (or have modified dependencies).

Releases are managed via CI and [semantic release](https://github.com/semantic-release/semantic-release).

## License

These components are licensed under the [MIT License](http://opensource.org/licenses/MIT).

## Sponsors

Project supported by [Scott Logic](http://www.scottlogic.com).
