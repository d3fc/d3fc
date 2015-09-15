# d3fc [![Build Status](https://travis-ci.org/ScottLogic/d3fc.svg?branch=master)](https://travis-ci.org/ScottLogic/d3fc)

A collection of components that make it easy to build interactive charts with D3.

## Installation

For details of installation and general usage, visit the [project webpage](http://scottlogic.github.io/d3fc/).

## Developing

[npm](https://www.npmjs.com/), the package manager for [Node.js](https://nodejs.org/), is used to manage the project's dependencies. [Grunt](http://gruntjs.com/), a JavaScript task runner, is used to test and build the project.

### Initial Setup

- Download or clone this repository locally
- Ensure [Node.js](https://nodejs.org/), which includes npm, is installed
- Ensure [Grunt](http://gruntjs.com/getting-started#installing-the-cli) is installed:

```
npm install -g grunt-cli
```

- Navigate to the root of your local copy of this project and install the dependencies:

```
npm install
```

### Grunt Tasks

The following Grunt tasks, found in `Gruntfile.js`, can be run from the command line. The most commonly used tasks to build and develop the project are:

- `grunt` - start a watcher which will automatically generate the project's JavaScript and CSS files in the _dist_ directory (at the root of the project) and run unit tests when files change.
- `grunt visualTests:serve` - start a watcher which will automatically generate the visual tests and serve them at http://localhost:8000/ when files change.
- `grunt site:serve` - start a watcher which will automatically generate the website and serve it at http://localhost:8000/ when files change.
- `grunt ci` - the full build run by the CI server

### Visual Tests

The project includes a number of unit tests, however, because these components are visual in nature, unit testing is not enough. This project contains a number of ad-hoc visual tests that are found within the `visual-tests` folder. The visual tests are compiled, via [assemble](http://assemble.io/), to create a simple website. To view this site, run `grunt visualTests:serve`.

## License

These components are licensed under the [MIT License](http://opensource.org/licenses/MIT).
