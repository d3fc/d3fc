---
layout: default
title: Moving Average
---

A [moving average](http://en.wikipedia.org/wiki/Moving_average) is an indicator that smooths out fluctuations in data. This component draws a [simple moving average](http://en.wikipedia.org/wiki/Moving_average#Simple_moving_average) line on a chart for a given data field, averaging the previous 5 points by default.

<div id="example_movingAverage" class="chart"> </div>

#### JavaScript

{% highlight javascript %}
// Create the moving average indicator
var movingAverage =
  fc.indicators.movingAverage()
    .xScale(xScale)     // associate the X and Y scales
    .yScale(yScale)
    .averagePoints(10); // specify the number of data points to average

// Add the indicator to the chart
chart.plotArea
  .datum(data)          // associate with the given chart data
  .call(movingAverage);
{% endhighlight %}

#### CSS

{% highlight css %}
.moving-average {
  fill: none;
  stroke: #69f;
  stroke-width: 1;
  stroke-dasharray: 3, 3;
}
{% endhighlight %}

#### SVG Output

{% highlight html %}
<g class="moving-average">
  <path d="..." class="moving-average"></path>
</g>
{% endhighlight %}

<script type="text/javascript">
(function(){
  var chart = createPlotArea(dataSeries1, '#example_movingAverage');

  // Create the OHLC series
  var ohlc = fc.series.ohlc()
    .xScale(chart.dateScale)
    .yScale(chart.priceScale);

  // Add the primary OHLC series
  chart.plotArea.selectAll('.series').remove();
  chart.plotArea.append('g')
    .attr('class', 'series')
    .datum(dataSeries1)
    .call(ohlc);

  // Create the moving average tracker
  var tracker = fc.indicators.movingAverage()
    .xScale(chart.dateScale)
    .yScale(chart.priceScale)
    .yValue(function(d) { return d.close; })
    .averagePoints(10);

  // Add it to the chart
  chart.plotArea
    .datum(dataSeries1)
    .call(tracker);
}());
</script>
