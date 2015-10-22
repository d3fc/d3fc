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
            .xDomain(fc.util.extent()(data, 'x'))
            .yDomain(fc.util.extent()(data, 'y'));

  // create a series and associate it with the plot area
  var line = fc.series.line()
    .xValue(function(d) { return d.x; })
    .yValue(function(d) { return d.y; });

  chart.plotArea(line);

  // render the chart
  d3.select('#cartesian-chart')
      .datum(data)
      .call(chart);

example-code-2: |

  // create some test data
  var data = d3.range(50).map(function(d) {
      return {
          x: d / 4,
          y: Math.sin(d / 4),
          z: Math.cos(d / 4) * 0.7
      };
  });

  // create a chart
  var chart = fc.chart.cartesian(
                d3.scale.linear(),
                d3.scale.linear())
            .margin({left: 50, bottom: 20})
            .xDomain(fc.util.extent()(data, 'x'))
            .xLabel('value')
            .xBaseline(0)
            .yDomain(fc.util.extent()(data, ['y', 'z']))
            .yNice()
            .yOrient('left')
            .yLabel('Sine / Cosine');

  // create a pair of series and some gridlines
  var sinLine = fc.series.line()
    .xValue(function(d) { return d.x; })
    .yValue(function(d) { return d.y; });

  var cosLine = fc.series.line()
    .xValue(function(d) { return d.x; })
    .yValue(function(d) { return d.z; });

  var gridlines = fc.annotation.gridline();

  // combine using a multi-series
  var multi = fc.series.multi()
    .series([gridlines, sinLine, cosLine]);

  chart.plotArea(multi);

  // render
  d3.select('#cartesian-chart-2')
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

The cartesian chart re-binds the various x and y axis properties. In the following example this is used to create a 'nice' y-scale and set the x-baseline, resulting in the axis being rendered at zero-line. The following also sets the plot area margins and adds labels: 

```js
{{{example-code-2}}}
```

And here is how that example looks:

<div id="cartesian-chart-2" style="height: 250px; width: 400px;"> </div>
<script type="text/javascript">
(function() {
  {{{example-code-2}}}
}());
</script>

