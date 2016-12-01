---
layout: example
title: Zoom Interactions
example: true
externals:
  zoom-js: zoom.js
  zoom-html: zoom.html
---

{{{ dynamic-include 'codepen' html='zoom-html' js='zoom-js'}}}
{{{ zoom-html }}}
{{{ dynamic-include 'javascript' js='zoom-js' }}}

This example shows how to integrate the d3fc Cartesian chart component with the D3 zoom behavior. Here's a brief summary of the code:

 - The geometric Brownian motion generator component from the {{{ hyperlink 'random-data-api.html' title='d3fc-random-data' }}} is used to create a random data series.
 - The data is rendered via an {{{ hyperlink 'series-api.html#area' title='area series' }}}, which is combined with  {{{ hyperlink 'annotation-api.html#gridline' title='gridlines' }}} via the {{{ hyperlink 'series-api.html#multi' title='multi series' }}} component. These are rendered on a {{{ hyperlink 'chart-api.html' title='Cartesian chart' }}}.
 - The [D3 zoom](https://github.com/d3/d3-zoom) component is used to capture mouse / touch interactions. This is added to the Cartesian chart via the decorate function, which provides access to the plot-area enter selection.
 - When a zoom event occurs, the `rescaleX` utility function is used to update the x scale domain.
 - Whenever the chart is rendered, the y scale is adjusted based on the visible range of data.

This example also shows a couple of interesting features of {{{ hyperlink 'element-api.html' title='d3fc-element' }}}, which is used internally by the Cartesian chart.

 1. The layout is performed by Cartesian chart, which results in the scale ranges being set. In order to access this measurement, the `measure` event fired by the underlying {{{ hyperlink 'element-api.html' title='d3fc-element components' }}} is handled.
 2. The use of {{{ hyperlink 'element-api.html' title='d3fc-element' }}}, which manages the measure and render cycles, ensures that the chart updates are 'latched' to the browser animation frames.

```js
{{{ codeblock zoom-js }}}
```
