---
layout: component
title: Line Series
component: series/line.js
namespace: Series
externals:
  line-example-js: line-example.js
  line-example-html: line-example.html
  step-example-js: step-example.js
  step-example-html: step-example.html
---

The line series renders the given data as a line, constructed from an SVG `path`:

```js
{{{ codeblock line-example-js }}}
```

Which gives the following:

{{{ dynamic-include 'codepen' html="line-example-html" js="line-example-js" }}}

{{{line-example-html}}}
<script type="text/javascript">
{{{line-example-js}}}
</script>

This series has the same properties for specifying the x and y value accessors, and decorate as the [point series](#point).

The line series component also exposes the `interpolate` and `tension` properties from the d3 line shape that it uses for rendering. For more information about the interpolation modes refer to the official [D3 Line Documentation](https://github.com/mbostock/d3/wiki/SVG-Shapes#line).

The following example demonstrates how to render a step series via the `step` interpolation mode:

```js
{{{ codeblock step-example-js }}}
```

Which gives the following:

{{{ dynamic-include 'codepen' html="step-example-html" js="step-example-js" }}}

{{{step-example-html}}}
<script type="text/javascript">
{{{step-example-js}}}
</script>
