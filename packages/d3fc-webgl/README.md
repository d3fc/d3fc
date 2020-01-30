# d3fc-webgl

A collection of WebGL shaders and supporting components used by [d3fc-series](https://github.com/d3fc/d3fc/tree/master/packages/d3fc-series#d3fc-series) to render WebGL series.

This package is still a work in progress and its API has not been finalised. Therefore, it is recommended that this package is not used directly.

# Shader Naming Convention

The naming convention for shader inputs follows the convention found on the [series-api page](https://d3fc.io/api/series-api.html) in the web docs.

One key difference is that shader inputs should be written in camelCase and have a qualifier prefix.

## Qualifier

Shader inputs can have one of three qualifiers. Each qualifier has a corresponding prefix.

| Qualifier | Prefix |
| --------- | ------ |
| Attribute | a      |
| Uniform   | u      |
| Varying   | v      |

For example: aCrossValue
