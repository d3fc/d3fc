---
layout: component
title: Simulated Annealing
component: layout/strategy/annealing.js
namespace: rectangle-strategy

example-code: |
  // Set up the strategy
  var strategy = fc.layout.strategy.annealing()
      .containerWidth(width)
      .containerHeight(height)
      .temperature(1000)
      .cooling(10);

  // the labels data
  var data = [
      { x: 100, y: 20, data: 'Hello'},
      { x: 170, y: 40, data: 'World'}, // overlaps with hello
      { x: 150, y: 65, data: 'd3fc'},  // overlaps with world
      { x: 250, y: 175, data: 'rocks'} // leaves the container
  ];

  // create the layout
  var layout = fc.layout.rectangles(strategy)
      .xScale(xScale)
      .yScale(yScale)
      .size([80, 30])
      .position([function(d) { return d.x; }, function(d) { return d.y; }])
      .anchor(function(index, xOffset, yOffset) { anchors[index] = {x: xOffset, y: yOffset}; })
      .component(label);

  // bind the data and render
  svg.datum(data)
      .call(layout);
---
The simulated annealing algorithm is a [rectangle](rectangles.html) layout strategy that runs over a set number of iterations, choosing a different location for one rectangle on each iteration. If that different location results in a better result, it is saved for the next iteration. Otherwise, it is saved with probability inversely proportional with the iteration it is currently on. This helps it break out of local optimums, hopefully producing better output. Because of the random nature of the algorithm, it produces variable output. It can be defined as follows:

```js
{{{example-code}}}
```

The `temperature` parameter indicates the initial 'number' to use for the random probability calculation, and `cooling` defines the delta of the temperature between iterations. The algorithm runs for `Math.ceil(temperature / cooling)` iterations.

The example is rendered as follows:

<div id="layout"></div>
<script type="text/javascript">
(function() {
  // create an SVG container
  var width = 400, height = 200;

  // a very simple example component
  function label(selection) {
      selection.append('circle')
          .attr('cx', function(d, i) {
              return anchors[i].x;
          })
          .attr('cy', function(d, i) {
              return anchors[i].y;
          })
          .attr('r', 5);
      selection.append('rect')
          .layout('flex', 1);
      selection.append('text')
          .text(function(d) { return d.data; })
          .attr({x: 20, y: 18});
      selection.layout();
  }

  var anchors = [];
  var svg = d3.select('#layout')
      .append('svg')
      .attr('width', width)
      .attr('height', height);

  // create scales that span the width / height of the SVG
  var xScale = d3.scale.linear()
      .range([0, width]);
  var yScale = d3.scale.linear()
      .range([height, 0]);
  {{{example-code}}}
}());
</script>
