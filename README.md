<p align="center">
<img alt="D3FC Logo" src="site/logo-stroke.svg" height="110px"/>
<br/><br/>
<a href="https://travis-ci.org/d3fc/d3fc"><img alt="Build status" src="https://travis-ci.org/d3fc/d3fc.svg?branch=master"/></a>
<a href="https://badge.fury.io/js/d3fc"><img alt="npm version" src="https://badge.fury.io/js/d3fc.svg"/></a>
</p>

**Components to rapidly build fast, highly customisable, interactive charts with D3**

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

-   [Building a Chart](https://github.com/d3fc/d3fc/tree/master/docs/building-a-chart.md) - a walk through building a chart with D3FC and what makes it different from other libraries.
-   [The Decorate Pattern](https://github.com/d3fc/d3fc/tree/master/docs/decorate-pattern.md) - the pattern D3FC employs, resulting in charting components that are both simple and flexible.
-   [Transitions](https://github.com/d3fc/d3fc/tree/master/docs/transitions.md) - how to use D3 transitions with D3FC.

For API documentation see the corresponding package documentation -

-   [d3fc-annotation](https://github.com/d3fc/d3fc/tree/master/packages/d3fc-annotation/README.md)
-   [d3fc-axis](https://github.com/d3fc/d3fc/tree/master/packages/d3fc-axis/README.md)
-   [d3fc-brush](https://github.com/d3fc/d3fc/tree/master/packages/d3fc-brush/README.md)
-   [d3fc-chart](https://github.com/d3fc/d3fc/tree/master/packages/d3fc-chart/README.md)
-   [d3fc-data-join](https://github.com/d3fc/d3fc/tree/master/packages/d3fc-data-join/README.md)
-   [d3fc-discontinuous-scale](https://github.com/d3fc/d3fc/tree/master/packages/d3fc-discontinuous-scale/README.md)
-   [d3fc-element](https://github.com/d3fc/d3fc/tree/master/packages/d3fc-element/README.md)
-   [d3fc-extent](https://github.com/d3fc/d3fc/tree/master/packages/d3fc-extent/README.md)
-   [d3fc-financial-feed](https://github.com/d3fc/d3fc/tree/master/packages/d3fc-financial-feed/README.md)
-   [d3fc-group](https://github.com/d3fc/d3fc/tree/master/packages/d3fc-group/README.md)
-   [d3fc-label-layout](https://github.com/d3fc/d3fc/tree/master/packages/d3fc-label-layout/README.md)
-   [d3fc-pointer](https://github.com/d3fc/d3fc/tree/master/packages/d3fc-pointer/README.md)
-   [d3fc-random-data](https://github.com/d3fc/d3fc/tree/master/packages/d3fc-random-data/README.md)
-   [d3fc-rebind](https://github.com/d3fc/d3fc/tree/master/packages/d3fc-rebind/README.md)
-   [d3fc-sample](https://github.com/d3fc/d3fc/tree/master/packages/d3fc-sample/README.md)
-   [d3fc-series](https://github.com/d3fc/d3fc/tree/master/packages/d3fc-series/README.md)
-   [d3fc-shape](https://github.com/d3fc/d3fc/tree/master/packages/d3fc-shape/README.md)
-   [d3fc-technical-indicator](https://github.com/d3fc/d3fc/tree/master/packages/d3fc-technical-indicator/README.md)
-   [d3fc-webgl](https://github.com/d3fc/d3fc/tree/master/packages/d3fc-webgl/README.md)
-   [d3fc-zoom](https://github.com/d3fc/d3fc/tree/master/packages/d3fc-zoom/README.md)

Examples can be found on the [project website](http://d3fc.io/). These same examples are also [available offline](https://github.com/d3fc/d3fc/tree/master/examples/README.md).

Framework integration examples:

-   [Streaming Chart in React](https://codepen.io/murcikan-scottlogic/pen/wvyxbjo)
-   [Streaming Chart in Angular](https://stackblitz.com/edit/angular-ivy-bsksgk?file=src/app/app.component.html)
-   [Streaming Chart in Svelte](https://stackblitz.com/edit/vitejs-vite-74afkj?file=src/App.svelte)

There are also a number of other documents and articles that provide a bit more background regarding the design principles of D3FC -

-   [Unboxing D3](https://medium.com/@ColinEberhardt/unboxing-d3-ec3d71196852) - there are numerous charting libraries that are 'built with D3', but all of them keep D3 'in its box' and as a result, you cannot unleash its full power!
-   [Extending D3 with Higher Order Components](https://medium.com/@ColinEberhardt/extending-d3-with-higher-order-components-d58cd40b7efd) - a brief article that walks through the process of building a chart with D3FC
-   [Building a Complex Financial Chart with D3 and D3FC](https://blog.scottlogic.com/2018/09/21/d3-financial-chart.html) - a lengthy and detailed article that builds a complex and bespoke chart which you can [view online here](https://colineberhardt.github.io/yahoo-finance-d3fc/).

## Developing

This project is a mono-repo that uses [Lerna](https://lernajs.io/) to manage dependencies between packages. To get started, run -

```
npm ci
npm test
```

<br/>

When making changes to a package, you can execute the following either from within the package folder to build just that package or from the project root to build all packages -

```
npm run bundle
```

<br/>

To open a development sandbox which is automatically updated when you save changes to source files, navigate to the project root and run -

```
npm start
```

### CI

This project is equipped with a Continuous Integration (CI) pipeline using GitHub Actions. It runs a series of checks whenever a pull request to master is opened. The pipeline includes the following steps:

-   Build: Verify that the code can be successfully built.
-   Test: Tests the application to ensure that new changes do not introduce regressions.
-   Linting: The code is analyzed for adherence to coding standards and best practices, using [eslint](https://eslint.org/), [markdownlint](https://github.com/DavidAnson/markdownlint), and [commitlint](https://github.com/conventional-changelog/commitlint).

See [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) for a more detailed explaination.

When opening a PR, be mindful of (and make necessary changes in accordance with) these checks.

### Releases

Releases are managed via CI and [Changesets](https://github.com/changesets/changesets). 

When contributing to the project, developers should add a changeset.

A changeset is a Markdown file with YAML front matter. The contents of the Markdown is the change summary which will be written to the changelog and the YAML front matter describes what packages have changed and what SemVer bump types they should be

```md
---
"@d3fc": major
"@d3fc/d3fc-annotation": minor
---

Change all the things
```

Changesets should include: 

* WHAT the change is
* WHY the change was made
* HOW a consumer should update their code 

#### Adding a changeset
To add a changeset, before putting up a PR, contributors should: 

1. Run the command line script `npx changeset`
2. Select the packages you want to include in the changeset using ↑ and ↓ to navigate to packages, and space to select a package.
3. Hit enter when all desired packages are selected.
4. You will be prompted to select a bump type for each selected package.
5. Select an appropriate bump type for the changes made. See [SemVer Versioning](#semver-versioning)

Your final prompt will be to provide a message to go alongside the changeset. This will be written into the changelog when the next release occurs.

[Source](https://github.com/changesets/changesets/blob/main/docs/adding-a-changeset.md)

Dependabot updates should not affect the consumer, and so do not need a Changeset. These will have PATCH (`x.x.1`) version bumps.

#### SemVer Versioning
From [SemVer](https://semver.org/) -

1. MAJOR version when you make incompatible API changes (`1.x.x`)
2. MINOR version when you add functionality in a backward compatible manner (`x.1.x`)
3. PATCH version when you make backward compatible bug fixes (`x.x.1`)

Github tags and releases are done using the [Tag Release on Push](https://github.com/marketplace/actions/tag-release-on-push-action) action. By default, a `minor` version bump will be added. To override this, use `release:major`, `release:minor`, or `release:patch` on PRs. Only one of these tags should be added to a PR.

From [SemVer](https://semver.org/) -

1. MAJOR version when you make incompatible API changes
2. MINOR version when you add functionality in a backward compatible manner
3. PATCH version when you make backward compatible bug fixes

### License

These components are licensed under the [MIT License](http://opensource.org/licenses/MIT).

## Sponsors

Project supported by [Scott Logic](http://www.scottlogic.com).
