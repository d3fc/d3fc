---
layout: component
title: Rectangles
component: layout/rectangles.js
namespace: layout

local-strategy: |
  var strategy = fc.layout.strategy.local()
      .containerWidth(width)
      .containerHeight(height)
      .iterations(15);

annealing-strategy: |
  var strategy = fc.layout.strategy.annealing()
      .containerWidth(width)
      .containerHeight(height)
      .temperature(1000)
      .cooling(10);

bb-strategy: |
  var strategy = fc.layout.strategy.boundingBox()
      .containerWidth(width)
      .containerHeight(height);

greedy-strategy: |
  var strategy = fc.layout.strategy.greedy()
      .containerWidth(width)
      .containerHeight(height);

callout-component: |
  // a very simple example component
  function label(selection) {
      selection.append('circle')
          .attr('cx', function(d) {
              return d.anchor[0];
          })
          .attr('cy', function(d) {
              return d.anchor[1];
          })
          .attr('r', 5);
      selection.append('rect')
          .layout('flex', 1);
      selection.append('text')
          .text(function(d) { return d.data; })
          .attr({x: 20, y: 18});
      selection.layout();
  }

example-code: |
  // the labels data
  var data = [
      { x: 100, y: 20, data: 'Hello'},
      { x: 170, y: 40, data: 'World'}, // overlaps with hello
      { x: 150, y: 65, data: 'd3fc'},  // overlaps with world
      { x: 250, y: 175, data: 'rocks'} // leaves the container
  ];

  // create scales that span the width / height of the SVG
  var xScale = d3.scale.linear()
      .range([0, width]);
  var yScale = d3.scale.linear()
      .range([height, 0]);

  // create the layout
  var layout = fc.layout.rectangles(strategy)
      .xScale(xScale)
      .yScale(yScale)
      .size([80, 30])
      .position([function(d) { return d.x; }, function(d) { return d.y; }])
      .anchor(function(d, i, pos) { d.anchor = pos; })
      .component(label);

  // bind the data and render
  svg.datum(data)
      .call(layout);
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
// create an SVG container
var width = 400, height = 200;
var svg = d3.select('#layout')
    .append('svg')
    .attr({width: width, height: height});

{{{greedy-strategy}}}
{{{example-code}}}
```

Which is rendered as follows:

<div id="layout"></div>
<script type="text/javascript">
(function() {
    // create an SVG container
    var width = 400, height = 200;
    var svg = d3.select('#layout')
        .append('svg')
        .attr({width: width, height: height});

    {{{callout-component}}}
    {{{greedy-strategy}}}
    {{{example-code}}}
}());
</script>

NOTE: The rectangles layout component sets the `layout-width` and `layout-height` attributes of the generated child component containers, this allows the child component to use [flexbox layout](/components/layout/flexbox.html).

The rectangles layout component can be used with different layout strategies which can, for example, ensure that rectangles do not overlap each other or all outside of the container.

## Layout strategies

### Greedy

The greedy strategy adds each rectangle in sequence, selecting the position where the rectangle has the lowest overlap with already added rectangles and is inside the container. It can be defined as follows:

```js
{{{greedy-strategy}}}
```

Which gives the following result:

<div id="greedy-layout"></div>
<script type="text/javascript">
(function() {
    // create an SVG container
    var width = 400, height = 200;
    var svg = d3.select('#greedy-layout')
        .append('svg')
        .attr({width: width, height: height});

    {{{callout-component}}}
    {{{greedy-strategy}}}
    {{{example-code}}}
}());
</script>

### Annealing

The simulated annealing layout strategy runs over a set number of iterations, choosing a different location for one rectangle on each iteration. If that location results in a better result, it is saved for the next iteration. Otherwise, it is saved with probability inversely proportional with the iteration it is currently on. This helps it break out of local optimums, hopefully producing better output. Because of the random nature of the algorithm, it produces variable output. It can be defined as follows:

```js
{{{annealing-strategy}}}
```

The `temperature` parameter indicates the initial 'number' to use for the random probability calculation, and `cooling` defines the delta of the temperature between iterations. The algorithm runs for `Math.ceil(temperature / cooling)` iterations.

The example is rendered as follows:

<div id="annealing-layout"></div>
<script type="text/javascript">
(function() {
    // create an SVG container
    var width = 400, height = 200;
    var svg = d3.select('#annealing-layout')
        .append('svg')
        .attr({width: width, height: height});

    {{{callout-component}}}
    {{{annealing-strategy}}}
    {{{example-code}}}
}());
</script>

### Bounding Box

The bounding box layout strategy moves a rectangle if it leaves the container. It does no overlap correction. It can be defined as follows:

```js
{{{bb-strategy}}}
```

Which gives the following result:

<div id="bb-layout"></div>
<script type="text/javascript">
(function() {
    // create an SVG container
    var width = 400, height = 200;
    var svg = d3.select('#bb-layout')
        .append('svg')
        .attr({width: width, height: height});

    {{{callout-component}}}
    {{{bb-strategy}}}
    {{{example-code}}}
}());
</script>

### Local

The local search layout strategy tries to resolve rectangle overlaps. It attempts to move each rectangle with an overlap to another potential placement with a better overlap. It can be defined as follows:

```js
{{{local-strategy}}}
```

The `iterations` property specifies the maximum number of times to iterate each point to find a better location. If the algorithm can't improve further, then it terminates.

The example is rendered as follows:

<div id="local-layout"></div>
<script type="text/javascript">
(function() {
    // create an SVG container
    var width = 400, height = 200;
    var svg = d3.select('#local-layout')
        .append('svg')
        .attr({width: width, height: height});

    {{{callout-component}}}
    {{{bb-strategy}}}
    {{{example-code}}}
}());
</script>
