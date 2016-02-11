---
layout: component
section: core
title: Rectangles
component: layout/rectangles.js
namespace: Layout
externals:
  rectangles-greedy-js: rectangles-greedy-example.js
  rectangles-greedy-html: rectangles-greedy-example.html
  rectangles-annealing-js: rectangles-annealing-example.js
  rectangles-annealing-html: rectangles-annealing-example.html
  rectangles-bb-js: rectangles-bb-example.js
  rectangles-bb-html: rectangles-bb-example.html
  rectangles-local-js: rectangles-local-example.js
  rectangles-local-html: rectangles-local-example.html
---

<style>
svg {
  border: 1px solid gray;
}
</style>

The rectangles layout component provides a mechanism for arranging child components based on their rectangular bounding boxes. It is typically used to render tooltips or labels on a chart. A layout strategy can be passed to the component in order to arrange the child rectangles avoiding collisions.

The component has `xScale` and `yScale` properties which it uses to determine the width and height of the overall container. Typically this component would be used with a [multi series](/components/series/multi.html) within a [cartesian chart](/components/chart/cartesian.html) hence these properties would not need to be set directly.

The `size` and `position` of each child can be specified via constants or as accessor functions of the underlying bound data.

When layout is applied, the `anchor` function is called for each rectangle. This supplies the relative change in the rectangles position. This can be used to draw a line between the rectangle and its original location.

The following example shows how a number of labels can be arranged by this layout component:

```js
{{{codeblock rectangles-greedy-js}}}
```

Which is rendered as follows:

{{{ dynamic-include 'codepen' html="rectangles-greedy-html" js="rectangles-greedy-js"}}}

{{{rectangles-greedy-html}}}
<script type="text/javascript">
{{{rectangles-greedy-js}}}
</script>

NOTE: The rectangles layout component sets the `layout-width` and `layout-height` attributes of the generated child component containers, this allows the child component to use [flexbox layout](/components/layout/flexbox.html).

The rectangles layout component can be used with different layout strategies which can, for example, ensure that rectangles do not overlap each other or all outside of the container.

## Layout strategies

### Greedy

The greedy strategy adds each rectangle in sequence, selecting the position where the rectangle has the lowest overlap with already added rectangles and is inside the container. It can be defined as follows:

```js
var strategy = fc.layout.strategy.greedy()
    .containerWidth(width)
    .containerHeight(height);
```

(See the example at the start of this page)

### Annealing

The simulated annealing layout strategy runs over a set number of iterations, choosing a different location for one rectangle on each iteration. If that location results in a better result, it is saved for the next iteration. Otherwise, it is saved with probability inversely proportional with the iteration it is currently on. This helps it break out of local optimums, hopefully producing better output. Because of the random nature of the algorithm, it produces variable output. It can be defined as follows:

```js
{{{codeblock rectangles-annealing-js}}}
```

The `temperature` parameter indicates the initial 'number' to use for the random probability calculation, and `cooling` defines the delta of the temperature between iterations. The algorithm runs for `Math.ceil(temperature / cooling)` iterations.

The example is rendered as follows:

{{{ dynamic-include 'codepen' html="rectangles-annealing-html" js="rectangles-annealing-js"}}}

{{{rectangles-annealing-html}}}
<script type="text/javascript">
{{{rectangles-annealing-js}}}
</script>

### Bounding Box

The bounding box layout strategy moves a rectangle if it leaves the container. It does no overlap correction. It can be defined as follows:

```js
{{{codeblock rectangles-bb-js}}}
```

Which gives the following result:

{{{ dynamic-include 'codepen' html="rectangles-bb-html" js="rectangles-bb-js"}}}

{{{rectangles-bb-html}}}
<script type="text/javascript">
{{{rectangles-bb-js}}}
</script>

### Local

The local search layout strategy tries to resolve rectangle overlaps. It attempts to move each rectangle with an overlap to another potential placement with a better overlap. It can be defined as follows:

```js
{{{codeblock rectangles-local-js}}}
```

The `iterations` property specifies the maximum number of times to iterate each point to find a better location. If the algorithm can't improve further, then it terminates.

The example is rendered as follows:

{{{ dynamic-include 'codepen' html="rectangles-local-html" js="rectangles-local-js"}}}

{{{rectangles-local-html}}}
<script type="text/javascript">
{{{rectangles-local-js}}}
</script>
