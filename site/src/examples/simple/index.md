---
layout: example
title: Line / Area Chart
namespace: examples

example-code: |
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
            .yDomain(fc.util.extent().pad(.2).fields(['y', 'z'])(data))
            .yLabel('Sine / Cosine')
            .yNice()
            .yOrient('left')
            .xDomain(fc.util.extent().fields('x')(data))
            .xLabel('value')
            .xBaseline(0)
            .margin({left: 50, bottom: 20});

  // create a pair of series and some gridlines
  var sinLine = fc.series.line()
    .xValue(function(d) { return d.x; })
    .yValue(function(d) { return d.y; });

  var cosLine = fc.series.area()
    .xValue(function(d) { return d.x; })
    .yValue(function(d) { return d.z; });

  var gridlines = fc.annotation.gridline();

  // combine using a multi-series
  var multi = fc.series.multi()
    .series([gridlines, sinLine, cosLine]);

  chart.plotArea(multi);

  // render
  d3.select('#example-chart')
      .datum(data)
      .call(chart);
---

<style>
#example-chart {
    margin-bottom: 20px;
    width: 100%;
    height: 400px;
}
.area {
  fill-opacity: 0.5;
}
</style>

<div id='example-chart'></div>

<script>
{{{example-code}}}
</script>

This example demonstrates how to a simple cartesian chart with a line and an area series. The chart is constructed from the following components:

 + A [cartesian chart](/components/chart/cartesian.html), with linear scales for x and y, is used to render the plot area, axes and labels. The `xBaseline` property is used to render the legend on the `y = 0` line.
 + The data is rendered via a [line series](/components/series/line.html) and an [area series](/components/series/area.html), these are combined into a single series using the [multi series](/components/series/multi.html) component.
 + A [gridlines component](/components/annotation/gridlines.html) is also added to the multi series.
 + The [extent](/components/util/extent.html) utility function is used to calculate the domain for the x and y scale, with padding applied to the y scale.

```js
{{{example-code}}}
```
