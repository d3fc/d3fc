---
layout: component
title: Cartesian
component: chart/cartesian.js
namespace: chart

example-code: |

  // create some test data
  var data = d3.range(50).map(function(d) {
      return {
          x: d / 3,
          y: Math.sin(d / 3)
      };
  });

  // create a chart with two linear axes
  var chart = fc.chart.cartesian(
                d3.scale.linear(),
                d3.scale.linear())
            .xDomain(fc.util.extent().fields('x')(data))
            .yDomain(fc.util.extent().fields('y')(data));

  // create a series and associate it with the plot area
  var line = fc.series.line()
    .xValue(function(d) { return d.x; })
    .yValue(function(d) { return d.y; });

  chart.plotArea(line);

  // render the chart
  d3.select('#cartesian-chart')
      .datum(data)
      .call(chart);
---

The cartesian chart is a component that combines a pair of scales, axes and labels with a 'plot area' which is a container where the associated series are rendered. The cartesian chart is responsible for the overall chart layout, ensuring that the axes are correctly aligned and the scale ranges are set accordingly.

The following simple example shows how to construct a cartesian chart, where a pair of linear axes (x and y), are supplied to the component factory function. The chart is responsible for setting the `xScale` and `yScale` properties of the series associated with the plot area:

```js
{{{example-code}}}
```

This results in the following chart:

<div id="cartesian-chart"> </div>
<script type="text/javascript">
(function() {
  {{{example-code}}}
}());
</script>

A number of the more [complex examples](/examples) use the cartesian chart as the basic 'boiler plate' for constructing a chart.
