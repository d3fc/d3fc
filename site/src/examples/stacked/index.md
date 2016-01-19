---
layout: example
example: true
title: Stacked Bar
externals:
    stacked-js: stacked.js
    stacked-html: stacked.html
    stacked-css: stacked.css
---

{{{ dynamic-include 'codepen' html="stacked-html" js="stacked-js" css="stacked-css"}}}

<style>
{{{stacked-css}}}
</style>

{{{stacked-html}}}

<script>
{{{stacked-js}}}
</script>

This example demonstrates how a stacked bar chart using energy production data from [eurostat](http://ec.europa.eu/eurostat/statistics-explained/index.php). The chart is constructed from the following components:

 + A [cartesian chart](/components/chart/cartesian.html), with an ordinal y axis and a linear x axis.
 + The data is prepared using the [spread](/components/data/spread.html) component, which creates a two dimensional array of data, followed by a d3 stack layout, which stacks the 'y' values.
 + The data is rendered via a horizontally oriented [stacked bar series](/components/series/stacked.html).
 + The [decorate pattern](/components/introduction/2-decorate-pattern.html) is also used to add a legend (courtesy of the [d3-legend](http://d3-legend.susielu.com) project). In this case, the legend is inserted into the SVG via the enter selection, with [svg flexbox](/components/layout/layout.html) used for positioning.

```js
{{{example-code}}}
```
