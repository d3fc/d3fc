---
layout: component
title: Rectangles
component: layout/rectangles.js
namespace: layout

example-code: |

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

  // the labels data
  var data = [
      { x: 100, y: 20, data: 'Hello'},
      { x: 50, y: 100, data: 'World'},
      { x: 150, y: 75, data: 'd3fc'},
      { x: 250, y: 150, data: 'rocks'}
  ];

  // create an SVG container
  var width = 400, height = 200;
  var svg = d3.select('#layout')
      .append('svg')
      .attr('width', width)
      .attr('height', height);

  // create scales that span the width / height of the SVG
  var xScale = d3.scale.linear()
      .range([0, width]);
  var yScale = d3.scale.linear()
      .range([height, 0]);

  var anchors = [];

  // create the layout
  var layout = fc.layout.rectangles()
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
The rectangles layout component provides a mechanism for arranging child components based on their rectangular bounding boxes. It is typically used to render tooltips or labels on a chart. A strategy will be used when one is included when `fc.layout.rectangles` is called -- these strategies can be found in the 'Rectangle Strategies' section of the documentation ([example](/components/rectangle-strategy/greedy.html)).

The component has `xScale` and `yScale` properties which it uses to determine the width and height of the overall container. Typically this component would be used with a [multi series](/components/series/multi.html) within a [cartesian chart](/components/chart/cartesian.html) hence these properties would not need to be set directly.

The `size` and `position` of each child can be specified via constants or as accessor functions of the underlying bound data.

If a rectangle moves position, its relative changed can be accessed using the `anchor` property.

The following example shows how a number of labels can be arranged by this layout component:

```js
{{{example-code}}}
```

Which is rendered as follows:

<div id="layout"></div>
<script type="text/javascript">
(function() {
    {{{example-code}}}
}());
</script>

NOTE: The rectangles layout component sets the `layout-width` and `layout-height` attributes of the generated child component containers, this allows the child component to use [flexbox layout](/components/layout/flexbox.html).

The rectangles layout component can be used with different layout strategies which can, for example, ensure that rectangles do not overlap each other or all outside of the container.
