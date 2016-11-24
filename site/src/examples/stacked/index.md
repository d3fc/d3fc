---
layout: example
title: Stacked Bar
example: true
externals:
  stacked-js: stacked.js
  stacked-html: stacked.html
  stacked-css: stacked.css
---

<style>
{{{stacked-css}}}
</style>

{{{ dynamic-include 'codepen' html='stacked-html' js='stacked-js'}}}
{{{ stacked-html }}}
{{{ dynamic-include 'javascript' js='stacked-js' }}}

This example demonstrates a stacked bar chart using energy production data from [eurostat](http://ec.europa.eu/eurostat/statistics-explained/index.php). The chart is constructed from the following components:

 - A {{{ hyperlink 'chart-api.html' title='cartesian chart' }}}, with an ordinal y axis and a linear x axis.
 - The data is prepared using the {{{ hyperlink 'group-api.html' title='group component' }}}, which creates a two dimensional array of data, followed by a D3 stack layout, which stacks the 'y' values.
 - The data is rendered via a horizontally oriented {{{ hyperlink 'series-api.html#stacked' title='stacked bar series' }}}.
 - The decorate pattern is also used to add a legend (courtesy of the [d3-legend](http://d3-legend.susielu.com) project).

```js
{{{ codeblock stacked-js }}}
```
