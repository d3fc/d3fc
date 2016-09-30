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

{{{ dynamic-include 'javascript-resize' js="stacked-js" }}}

This example demonstrates how a stacked bar chart using energy production data from [eurostat](http://ec.europa.eu/eurostat/statistics-explained/index.php). The chart is constructed from the following components:

 + A {{{ hyperlink 'cartesian.html' title='cartesian chart' }}}, with an ordinal y axis and a linear x axis.
 + The data is prepared using the {{{ hyperlink 'spread.html' title='spread' }}} component, which creates a two dimensional array of data, followed by a D3 stack layout, which stacks the 'y' values.
 + The data is rendered via a horizontally oriented {{{ hyperlink 'stacked.html' title='stacked bar series' }}}.
 + The {{{ hyperlink 'decorate-pattern.html' title='decorate pattern' }}} is also used to add a legend (courtesy of the [d3-legend](http://d3-legend.susielu.com) project). In this case, the legend is inserted into the SVG via the enter selection, with {{{ hyperlink 'flexbox.html' title='svg flexbox' }}} used for positioning.

```js
{{{stacked-js}}}
```
