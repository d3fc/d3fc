<p align="center">
<img alt="D3FC Logo" src="site/logo-stroke.svg" height="110px"/>
<br/><br/>
<a href="https://travis-ci.org/d3fc/d3fc"><img alt="Build status" src="https://travis-ci.org/d3fc/d3fc.svg?branch=master"/></a>
<a href="https://badge.fury.io/js/d3fc"><img alt="npm version" src="https://badge.fury.io/js/d3fc.svg"/></a>
</p>

__Components to rapidly build fast, highly customisable, interactive charts with D3__

## Installation

The latest release of D3FC is available via npm or the unpkg CDN. The D3FC project is composed of a number of separate packages each of which can be installed via npm and used independently, or if you prefer you can install the entire D3FC bundle, which includes all of the separate packages -

```
npm install d3fc
```

```html
<script src="https://unpkg.com/d3"></script>
<script src="https://unpkg.com/d3fc"></script>
```

Test your installation using the [simple chart example](https://github.com/d3fc/d3fc/tree/master/examples/simple-chart).

## Documentation

The following getting-started guides are available -

- [Building a Chart](https://github.com/d3fc/d3fc/tree/master/docs/building-a-chart.md) - a walk through building a chart with D3FC and what makes it different from other libraries.
- [The Decorate Pattern](https://github.com/d3fc/d3fc/tree/master/docs/decorate-pattern.md) - the pattern D3FC employs, resulting in charting components that are both simple and flexible.
- [Transitions](https://github.com/d3fc/d3fc/tree/master/docs/transitions.md) - how to use D3 transitions with D3FC.

For API documentation see the corresponding package documentation -

* [d3fc-annotation](https://github.com/d3fc/d3fc/tree/master/packages/d3fc-annotation/README.md)
* [d3fc-axis](https://github.com/d3fc/d3fc/tree/master/packages/d3fc-axis/README.md)
* [d3fc-brush](https://github.com/d3fc/d3fc/tree/master/packages/d3fc-brush/README.md)
* [d3fc-chart](https://github.com/d3fc/d3fc/tree/master/packages/d3fc-chart/README.md)
* [d3fc-data-join](https://github.com/d3fc/d3fc/tree/master/packages/d3fc-data-join/README.md)
* [d3fc-discontinuous-scale](https://github.com/d3fc/d3fc/tree/master/packages/d3fc-discontinuous-scale/README.md)
* [d3fc-element](https://github.com/d3fc/d3fc/tree/master/packages/d3fc-element/README.md)
* [d3fc-extent](https://github.com/d3fc/d3fc/tree/master/packages/d3fc-extent/README.md)
* [d3fc-financial-feed](https://github.com/d3fc/d3fc/tree/master/packages/d3fc-financial-feed/README.md)
* [d3fc-group](https://github.com/d3fc/d3fc/tree/master/packages/d3fc-group/README.md)
* [d3fc-label-layout](https://github.com/d3fc/d3fc/tree/master/packages/d3fc-label-layout/README.md)
* [d3fc-pointer](https://github.com/d3fc/d3fc/tree/master/packages/d3fc-pointer/README.md)
* [d3fc-random-data](https://github.com/d3fc/d3fc/tree/master/packages/d3fc-random-data/README.md)
* [d3fc-rebind](https://github.com/d3fc/d3fc/tree/master/packages/d3fc-rebind/README.md)
* [d3fc-sample](https://github.com/d3fc/d3fc/tree/master/packages/d3fc-sample/README.md)
* [d3fc-series](https://github.com/d3fc/d3fc/tree/master/packages/d3fc-series/README.md)
* [d3fc-shape](https://github.com/d3fc/d3fc/tree/master/packages/d3fc-shape/README.md)
* [d3fc-technical-indicator](https://github.com/d3fc/d3fc/tree/master/packages/d3fc-technical-indicator/README.md)
* [d3fc-webgl](https://github.com/d3fc/d3fc/tree/master/packages/d3fc-webgl/README.md)
* [d3fc-zoom](https://github.com/d3fc/d3fc/tree/master/packages/d3fc-zoom/README.md)

Examples can be found on the [project website](http://d3fc.io/). These same examples are also [available offline](https://github.com/d3fc/d3fc/tree/master/examples/README.md).

There are also a number of other documents and articles that provide a bit more background regarding the design principles of D3FC -

 - [Unboxing D3](https://medium.com/@ColinEberhardt/unboxing-d3-ec3d71196852) - there are numerous charting libraries that are 'built with D3', but all of them keep D3 'in its box' and as a result, you cannot unleash its full power!
 - [Extending D3 with Higher Order Components](https://medium.com/@ColinEberhardt/extending-d3-with-higher-order-components-d58cd40b7efd) - a brief article that walks through the process of building a chart with D3FC
 - [Building a Complex Financial Chart with D3 and D3FC](https://blog.scottlogic.com/2018/09/21/d3-financial-chart.html) - a lengthy and detailed article that builds a complex and bespoke chart which you can [view online here](https://colineberhardt.github.io/yahoo-finance-d3fc/).

## Developing

This project is a mono-repo that uses [Lerna](https://lernajs.io/) to manage dependencies between packages. To get started, run -
~~~
npm ci
npm test
~~~

<br/>

When making changes to a package, you can execute the following either from within the package folder to build just that package or from the project root to build all packages -
~~~
npm run bundle
~~~

<br/>

To open a development sandbox which is automatically updated when you save changes to source files, navigate to the project root and run -
~~~
npm start
~~~


### Releases

Releases are managed via CI and [semantic release](https://github.com/semantic-release/semantic-release).

### License

These components are licensed under the [MIT License](http://opensource.org/licenses/MIT).

## Sponsors

Project supported by [Scott Logic](http://www.scottlogic.com).
