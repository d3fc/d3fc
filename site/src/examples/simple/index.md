---
layout: example
title: Line / Area Chart
example: true
externals:
  simple-js: simple.js
  simple-html: simple.html
---

{{{ dynamic-include 'codepen' html='simple-html' js='simple-js'}}}
{{{ simple-html }}}
{{{ dynamic-include 'javascript' js='simple-js' }}}

This example demonstrates how to a simple cartesian chart with a line and an area series. The chart is constructed from the following components:

 + A {{{ hyperlink 'chart-api.html' title='cartesian chart' }}}, with linear scales for x and y, is used to render the plot area, axes and labels.
 + The data is rendered via a {{{ hyperlink 'series-api.html#line' title='line series' }}} and an {{{ hyperlink 'series-api.html#area' title='area series' }}}, these are combined into a single series using the {{{ hyperlink 'series-api.html#multi' title='multi series' }}} component.
 + A {{{ hyperlink 'annotation-api.html#gridline' title='gridlines component' }}} is also added to the multi series.
 + The {{{ hyperlink 'extent-api.html' title='extent' }}} utility function is used to calculate the domain for the x and y scale, with padding applied to the y scale.


```js
{{{ codeblock simple-js }}}
```
