---
layout: component
title: Legend
namespace: chart

example-code: |
  // create a scale
  var color = d3.scale.category10()
    .domain(['Cat', 'Dog', 'Fish']);

  // construct a legend for this scale
  var legend = d3.legend.color()
    .scale(color);

  // create a container
  var legendContainer = fc.tool.container()
      .padding(5)
      .component(legend);

  // create an SVG container
  var width = 60, height = 60;
  var svg = d3.select('#legend')
      .append('svg')
      .attr('width', width)
      .attr('height', height);

  // render
  svg.call(legendContainer);
---

<style>
.container>rect {
  fill: white;
  stroke: #bbb;
}
</style>

Rather than write our own d3fc legend, we discovered that someone had already [created a pretty awesome one](http://d3-legend.susielu.com), so we decided to integrate that one instead! This project uses the `d3-svg-legend`, component which is included in the d3fc bundle.

The d3-legend doesn't render a background, although this can easily be added via the [container component](/components/tool/container.html).

The d3-legend is constructed from a scale as shown below:

```js
{{{example-code}}}
```

<div id="legend"></div>
<script type="text/javascript">
(function() {
    {{{example-code}}}
}());
</script>

For further details regarding the extensive API of this component, consult the [project homepage](http://d3-legend.susielu.com).
