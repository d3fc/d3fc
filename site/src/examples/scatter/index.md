---
layout: example
example: true
title: Scatterplot
externals:
    scatter-js: scatter.js
    scatter-html: scatter.html
    scatter-css: scatter.css
---

{{{ dynamic-include 'codepen' html="scatter-html" js="scatter-js" css="scatter-css"}}}

<style>
{{{scatter-css}}}
</style>

{{{scatter-html}}}

{{{ dynamic-include 'javascript-resize' js="scatter-js" }}}


(based on [bl.ock #3887118](http://bl.ocks.org/mbostock/3887118#index.html) by Mike Bostock)

This example demonstrates how to render a simple scatter plot with data from the [Iris flower dataset](https://en.wikipedia.org/wiki/Iris_flower_data_set). The chart is constructed from the following components:

 + The `d3.tsv` component is used to load a tab-separated data file.
 + A {{{ hyperlink 'cartesian.html' title='cartesian chart' }}}, with linear scales for x and y, is used to render the plot area, axes and labels.
 + A {{{ hyperlink 'point.html' title='point series' }}} is used to render the data, with the {{{ hyperlink 'decorate-pattern.html' title='decorate pattern' }}} used to colour each point.
 + The {{{ hyperlink 'decorate-pattern.html' title='decorate pattern' }}} is also used to add a legend (courtesy of the [d3-legend](http://d3-legend.susielu.com) project). In this case, the legend is inserted into the SVG via the enter selection, with {{{ hyperlink 'flexbox.html' title='svg flexbox' }}} used for positioning.


```js
{{{scatter-js}}}
```
