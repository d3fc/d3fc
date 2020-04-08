<p align="center">
<img alt="D3FC Logo" src="packages/d3fc-site/src/images/logo_outline.svg" height="110px"/>
<br/><br/>
<a href="https://travis-ci.org/d3fc/d3fc"><img alt="Build status" src="https://travis-ci.org/d3fc/d3fc.svg?branch=master"/></a>
<a href="https://badge.fury.io/js/d3fc"><img alt="npm version" src="https://badge.fury.io/js/d3fc.svg"/></a>
</p> 

__Components to rapidly build fast, highly customisable, interactive charts with D3__

## Installation

D3FC and its dependencies are available via npm or the unpkg CDN. The D3FC project is composed of a number of separate packages, detailed in the API documentation. Each of these packages can be installed via npm and used independently, or if you prefer you can install the entire D3FC bundle, which includes all of the separate packages.

```
npm install d3fc
```

```
<script src="https://unpkg.com/d3"></script>
<script src="https://unpkg.com/d3fc"></script>
```

## Documentation

The project is split into sub-packages, see the packages/*/README.md files for API and usage documentation.

Examples can be found on the [project website](http://d3fc.io/) (these same examples are also available offline - see examples/README.md).

## Developing

This project is a mono-repo that uses [Lerna](https://lernajs.io/) to manage dependencies between packages. To get started, run:
~~~
npm install
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


## Releases

Releases are managed via CI and [semantic release](https://github.com/semantic-release/semantic-release).

## License

These components are licensed under the [MIT License](http://opensource.org/licenses/MIT).

## Sponsors

Project supported by [Scott Logic](http://www.scottlogic.com).
