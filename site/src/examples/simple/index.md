---
layout: example
example: true
title: Line / Area Chart
externals:
    simple-js: simple.js
    simple-html: simple.html
    simple-css: simple.css
---

{{{ dynamic-include 'codepen' html="simple-html" js="simple-js" css="simple-css"}}}

<style>
{{{simple-css}}}
</style>

{{{simple-html}}}

{{{ dynamic-include 'javascript-resize' js="simple-js" }}}

This example demonstrates how to a simple cartesian chart with a line and an area series. The chart is constructed from the following components:

 + A [cartesian chart](/components/chart/cartesian.html), with linear scales for x and y, is used to render the plot area, axes and labels. The `xBaseline` property is used to render the legend on the `y = 0` line.
 + The data is rendered via a [line series](/components/series/line.html) and an [area series](/components/series/area.html), these are combined into a single series using the [multi series](/components/series/multi.html) component.
 + A [gridlines component](/components/annotation/gridlines.html) is also added to the multi series.
 + The [extent](/components/util/extent.html) utility function is used to calculate the domain for the x and y scale, with padding applied to the y scale.

```js
{{{simple-js}}}
```
