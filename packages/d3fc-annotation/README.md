# d3fc-package-archetype

An archetype for other d3fc projects, includes linter, bundling and test configuration

 - **Linting** - linting is performed by eslint, using the `eslint-config-standard` configuration, with a few customisations.
 - **Test** - Jasmine is used for testing, with `babel-register` used as a Jasmine helper so that tests can be run without bundling.
 - **Bundling** - Rollup is used for bundling. As it requires using babel with its own presets, `es2015-rollup`, with rollup the `.babelrc` file is ignored.

## Instructions

In order to create a new d3fc package:

  1. Create a copy of the code in this repo.
  2. Find and replace `d3fc-package-archetype` with the new package name.
  3. Update the description in `package.json`
  4. Run `semantic-release-cli init` - updating the npm script to include the bundling step:
```
semantic-release pre && npm run bundle && npm publish && semantic-release post
```
  5. Run `greenkeeper enable`
