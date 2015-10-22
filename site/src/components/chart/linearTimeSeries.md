---
layout: component
title: Linear Time Series
component: chart/linearTimeSeries.js
namespace: chart

example-code: |

  // create some test data
  var data = fc.data.random.financial()(80);

  // create a chart
  var chart = fc.chart.linearTimeSeries()
      .xDomain(fc.util.extent()(data, 'date'))
      .xTicks(5)
      .yDomain(fc.util.extent()(data, ['high', 'low']))
      .yNice()
      .yTicks(5);

  var gridlines = fc.annotation.gridline();
  var candlestick = fc.series.candlestick();

  var multi = fc.series.multi()
      .series([gridlines, candlestick]);
  chart.plotArea(multi);

  d3.select('#linear-time-series')
      .append('svg')
      .style({
          height: '250px',
          width: '600px'
      })
      .datum(data)
      .call(chart);
---

The linear time series is a 'top level' d3fc component that has been assembled from a number of other smaller components. The linear time series has a date time x-axis and a linear y-axis, with the domain, ticks and other properties re-bound so that they are exposed on the linear time series chart directly.

The chart has a `plotArea` property which is used to supply the series, or any other component that is rendered within the plot area.

The following is a complete example which renders a few different series types:

```js
{{{example-code}}}
```

Note that the chart is responsible for setting the `xScale` and `yScale` properties of the items added to the `plotArea`. In this case a multi-series is added, which multiplexes these values.

Here is what the rendered chart looks like:

<div id="linear-time-series" class="chart"> </div>
<script type="text/javascript">
(function() {
  {{{example-code}}}
}());
</script>

