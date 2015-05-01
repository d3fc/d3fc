---
layout: default
title: Linear Time Series
component: chart/linearTimeSeries.js

example-code: |
  
  // create some test data
  var data = fc.utilities.dataGenerator()(80);

  // create a chart
  var chart = fc.charts.linearTimeSeries()
      .xDomain(fc.utilities.extent(data, 'date'))
      .xTicks(5)
      .yDomain(fc.utilities.extent(data, ['high', 'low']))
      .yNice()
      .yTicks(5);

  // Create the gridlines
  var gridlines = fc.scale.gridlines();
  var candlestick = fc.series.candlestick();
  var movingAverage = fc.indicators.movingAverage();

  var multi = fc.series.multi()
      .series([gridlines, candlestick, movingAverage]);
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

The linear time series is a 'top level' D3FC component that has been assembled from a number of other smaller components. The linear time series has a date time x-axis and a linear y-axis, with the domain, ticks and other properties re-bound so that they are exposed on the linear time series chart directly.

The chart has a `plotArea` property which is used to supply the series, or any other component that is rendered within the plot area.

The following is a complete example which renders a few different series types:

{% highlight javascript %}
{{ page.example-code }}
{% endhighlight %}

Note that the chart is responsible for setting the `xScale` and `yScale` properties of the items added to the `plotArea`. In this case a multi-series is added, which multiplexes these values.

Here is what the rendered chart looks like:

<div id="linear-time-series" class="chart"> </div>
<script type="text/javascript">
(function() {
  {{ page.example-code }}
}());
</script>

