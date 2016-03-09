---
layout: section
section: core
title: Rectangles
component: layout/rectangles.js
namespace: Layout
externals:
  rectangles-example-css: rectangles-example.css
  rectangles-example-measure-js: rectangles-example-measure.js
  rectangles-example-measure-html: rectangles-example-measure.html
---

The rectangles layout component provides a mechanism for arranging child components based on their rectangular bounding boxes. It is typically used to render tooltips or labels on a chart, but can also be used to render labels on maps. A layout strategy can be passed to the component in order to arrange the child rectangles avoiding collisions. A filter function can also be applied in order to remove overlaps or post-process the layout.

The `size` and `position` of each child can be specified via constants or as accessor functions of the underlying bound data. The rectangles layout component operates in the screen coordinate system, hence these values are both in pixels.

The component has `xScale` and `yScale` properties, which are provided as a convenient mechanism for determining the overall bounding box when used in conjunction with a {{{ hyperlink 'cartesian.html' title='cartesian chart' }}}. This information is used by a number of the layout strategies in order to keep the 'rectangles' within the chart plot area.

The following example shows how a number of labels can be arranged by this layout component:


```js
{{{codeblock rectangles-example-measure-js}}}
```

Which renders the following:

{{{ dynamic-include 'codepen' html="rectangles-example-measure-html" js="rectangles-example-measure-js" css="rectangles-example-css"}}}

<style>
{{{rectangles-example-css}}}
</style>

{{{rectangles-example-measure-html}}}
<script type="text/javascript">
{{{rectangles-example-measure-js}}}
</script>

NOTE: The rectangles layout component sets the `layout-width` and `layout-height` attributes of the generated child component containers, this allows the child component to use {{{ hyperlink 'flexbox.html' title='flexbox layout' }}}.

The rectangles layout adds the 'child' components before the `size` function is invoked. In the above example this is used to measure the size of the text label before layout occurs.

This example also makes use of the `fc.layout.strategy.removeOverlaps` strategy that is applied as a `filter` in order to cull labels that overlap.

There are a number of strategies that can be used to resolve overlaps, these include:

 + `greedy` - The greedy strategy adds each rectangle in sequence, selecting the position where the rectangle has the lowest overlap with already added rectangles and is inside the container.
 + `annealing` - The simulated annealing layout strategy runs over a set number of iterations, choosing a different location for one rectangle on each iteration. If that location results in a better result, it is saved for the next iteration. Otherwise, it is saved with probability inversely proportional with the iteration it is currently on. This helps it break out of local optimums, hopefully producing better output. Because of the random nature of the algorithm, it produces variable output. The `temperature` parameter indicates the initial 'number' to use for the random probability calculation, and `cooling` defines the delta of the temperature between iterations. The algorithm runs for `Math.ceil(temperature / cooling)` iterations.
 + `boundingBox`- The bounding box layout strategy moves a rectangle if it leaves the container. It does no overlap correction.
 + `local` - The local search layout strategy tries to resolve rectangle overlaps. It attempts to move each rectangle with an overlap to another potential placement with a better overlap.
