<p align="center">
<img alt="D3FC Logo" src="packages/d3fc-site/src/images/logo_outline.svg" height="110px"/>
<br/><br/>
<a href="https://travis-ci.org/d3fc/d3fc"><img alt="Build status" src="https://travis-ci.org/d3fc/d3fc.svg?branch=master"/></a>
<a href="https://badge.fury.io/js/d3fc"><img alt="npm version" src="https://badge.fury.io/js/d3fc.svg"/></a>
</p>

__Components to rapidly build fast, highly customisable, interactive charts with D3__

## Installation

The latest release of D3FC is available via npm or the unpkg CDN. The D3FC project is composed of a number of separate packages each of which can be installed via npm and used independently, or if you prefer you can install the entire D3FC bundle, which includes all of the separate packages:

```
npm install d3fc
```

```html
<script src="https://unpkg.com/d3"></script>
<script src="https://unpkg.com/d3fc"></script>
```

## Documentation

The project is split into sub-packages, see the package-specific README.md files in the [packages folder](https://github.com/d3fc/d3fc/tree/master/packages) for API-level documentation and usage guidelines.

Examples can be found on the [project website](http://d3fc.io/) (these same examples are also available offline - see examples/README.md).

There are also a number of other documents and articles that provide a bit more background regarding the design principles of D3FC:

 - [Unboxing D3](https://medium.com/@ColinEberhardt/unboxing-d3-ec3d71196852) - there are numerous charting libraries that are 'built with D3', but all of them keep D3 'in its box' and as a result, you cannot unleash its full power!
 - [The Decorate Pattern](/decorate-pattern.md) - the pattern D3FC employs, resulting in charting components that are both simple and flexible.
 - [Extending D3 with Higher Order Components](https://medium.com/@ColinEberhardt/extending-d3-with-higher-order-components-d58cd40b7efd) - a brief article that walks through the process of building a chart with D3FC
 - [Building a Complex Financial Chart with D3 and D3FC](https://blog.scottlogic.com/2018/09/21/d3-financial-chart.html) - a lengthy and detailed article that builds a complex and bespoke chart which you can [view online here](https://colineberhardt.github.io/yahoo-finance-d3fc/).

## Developing

This project is a mono-repo that uses [Lerna](https://lernajs.io/) to manage dependencies between packages. To get started, run:
~~~
npm ci
npm test
~~~

<br/>

When making changes to a package, you can execute the following either from within the package folder to build just that package or from the project root to build all packages.
~~~
npm run bundle
~~~

<br/>

To open a development sandbox which is automatically updated when you save changes to source files, navigate to the project root and run
~~~
npm start
~~~


### Releases

Releases are managed via CI and [semantic release](https://github.com/semantic-release/semantic-release).

### License

These components are licensed under the [MIT License](http://opensource.org/licenses/MIT).

## Sponsors

Project supported by [Scott Logic](http://www.scottlogic.com).
