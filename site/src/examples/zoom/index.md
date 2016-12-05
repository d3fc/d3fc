---
layout: example
title: Canvas Chart Zoom
example: true
externals:
  zoom-js: zoom.js
  zoom-html: zoom.html
---

{{{ dynamic-include 'codepen' html='zoom-html' js='zoom-js'}}}
{{{ zoom-html }}}
{{{ dynamic-include 'javascript' js='zoom-js' }}}

This example demonstrates the rendering of 10,000 datapoints with pan / zoom via [d3-zoom](https://github.com/d3/d3-zoom). As you manipulate the chart it is being re-rendered by invoking `selection.call` on the top level component. Rendering the data to Canvas is approximately x10 faster than SVG in this case.

The visual d3fc components support rendering to both Canvas and SVG. In this case the `cartesianCanvasChart` and `seriesCanvasPoint` are used to render the chart. You can swap then for SVG simply by changing the to `cartesianSvgChart` and `seriesSvgPoint`.

```js
{{{ codeblock zoom-js }}}
```
