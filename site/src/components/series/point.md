---
layout: section
section: core
title: Point Series
component: series/point.js
namespace: Series
externals:
  point-example-js: point-example.js
  point-example-html: point-example.html
  point-shape-example-js: point-shape-example.js
  point-shape-example-html: point-shape-example.html
---

The point series renders the given data as a series of symbols which are produced via the [`d3.svg.symbol`](https://github.com/mbostock/d3/wiki/SVG-Shapes#symbol) generator.  By default, it renders circles with an area of 64 pixels.

```js
{{{ codeblock point-example-js }}}
```

Which gives the following:

{{{ dynamic-include 'codepen' html="point-example-html" js="point-example-js" }}}

{{{point-example-html}}}
<script type="text/javascript">
{{{point-example-js}}}
</script>

The series assumes that each object has a `date` property which defines its x-location, and a `close` property which
defines its y-location. However, these can be changed via the `xValue` and `yValue` properties.

As the series is built using the `d3.svg.symbol`, the following symbol `types` are also supported:

* circle - a circle.
* cross - a Greek cross or plus sign.
* diamond - a rhombus.
* square - an axis-aligned square.
* triangle-down - a downward-pointing equilateral triangle.
* triangle-up - an upward-pointing equilateral triangle.

You can specify the symbol via `type` property, e.g. `type('diamond')`, or provide a function as illustrated in the example below:


```js
{{{ codeblock point-shape-example-js }}}
```

Which shows different kinds of shapes that can be used:

{{{ dynamic-include 'codepen' html="point-shape-example-html" js="point-shape-example-js" }}}

{{{point-shape-example-html}}}
<script type="text/javascript">
{{{point-shape-example-js}}}
</script>
