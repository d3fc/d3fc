---
layout: component
title: Greedy
component: layout/strategy/greedy.js
namespace: rectangle-strategy

example-code: |
  // Set up the strategy
  var strategy = fc.layout.strategy.greedy()
      .containerWidth(width)
      .containerHeight(height);

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
The greedy layout algorithm is a [rectangle](rectangles.html) layout strategy that adds each rectangle in sequence, selecting the position where the rectangle has the lowest overlap with already added rectangles and is inside the container. It can be defined as follows:

```js
{{{example-code}}}
```

Which is rendered as follows:

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
