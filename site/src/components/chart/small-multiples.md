---
layout: section
section: core
title: Small Multiples
component: chart/smallMultiples.js
namespace: Chart
externals:
  multiples-example-js: multiples-example.js
  multiples-example-html: multiples-example.html
  multiples-example-css: multiples-example.css
  multiples-example2-js: multiples-example-2.js
  multiples-example2-html: multiples-example-2.html
  multiples-example3-js: multiples-example-3.js
  multiples-example3-html: multiples-example-3.html
---

A small multiples chart renders a number of series that share the same scales as a grid of tiles. The small multiples component renders an array of data, where each item has a key and an associated array of values (configurable by the `key` and `values` properties respectively). An easy way to prepare the data so that it is in the correct form is to use the `d3.nest`, or d3fc [`spread`](/components/data/spread.html) components.

The following example renders some sales data, grouped by the day of the week. The small multiples component is configured to render a seven column layout:

```js
{{{ codeblock multiples-example-js}}}
```

This results in the following chart:

{{{ dynamic-include 'codepen' html="multiples-example-html" js="multiples-example-js" css="multiples-example-css"}}}

{{{multiples-example-html}}}
<script type="text/javascript">
{{{multiples-example-js}}}
</script>

From the above example it can be seen that the small multiples component has a similar API to the {{{ hyperlink 'cartesian.html' title='cartesian chart' }}}, re-binding the various x and y axis properties, and exposing `plotArea` and `margin` properties.

The following example demonstrates a small multiples chart with a multi-row grid layout. In this example temperature data is loaded from a CSV file, with `d3.nest` used to manipulate the data into the required format. A multi-series component is used to render a couple of lines on each multiple plot.

```js
{{{multiples-example2-js}}}
```

This gives the following small multiples:

{{{ dynamic-include 'codepen' html="multiples-example2-html" js="multiples-example2-js"}}}

{{{multiples-example2-html}}}
<script type="text/javascript">
{{{multiples-example2-js}}}
</script>

The next example uses data from [this example](http://bl.ocks.org/mbostock/1157787) to show how the y domain can be varied for each row of multiples.

An accessor function is passed to the `yDomain` property so a domain can be calculated for each row. The same can be achieved when varying the x domain for each column using the `xDomain` property.

```js
{{{multiples-example3-js}}}
```

This gives the following small multiples:

{{{ dynamic-include 'codepen' html="multiples-example3-html" js="multiples-example3-js"}}}

{{{multiples-example3-html}}}
<script type="text/javascript">
{{{multiples-example3-js}}}
</script>