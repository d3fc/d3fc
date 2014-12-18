---
layout: default
title: Bollinger Bands
---

This component calculates and draws Bollinger bands on a data series, calculated using a moving average and a standard deviation value.

<div id="example_bollinger" class="chart"> </div>

#### JavaScript

{% highlight javascript %}
// Create the Bollinger bands component
var bollinger = fc.indicators.bollingerBands()
  .xScale(chart.dateScale)
  .yScale(chart.priceScale)
  .movingAverage(10)
  .standardDeviations(2);

// Add it to the chart
chart.plotArea.append('g')
  .attr('class', 'bollinger-band')
  .datum(dataSeries1)
  .call(bollinger);
{% endhighlight %}

#### CSS

{% highlight css %}
.bollingerBandArea {
  fill: lightgrey;
  stroke-width: 0;
  opacity: 0.5;
}

.bollingerBandUpper {
  fill: none;
  stroke: darkgrey;
  stroke-width: 2;
}

.bollingerBandLower {
  fill: none;
  stroke: darkgrey;
  stroke-width: 2;
}

.bollingerAverage {
  fill: none;
  stroke: darkgrey;
  stroke-width: 1;
  stroke-dasharray: 4, 1;
}
{% endhighlight %}

#### SVG Output

{% highlight html %}
<g class="bollinger-band">
  <path class="area bollingerBandArea"></path>
  <path class="upper bollingerBandUpper"></path>
  <path class="lower bollingerBandLower"></path>
  <path class="average bollingerAverage"></path>
</g>
{% endhighlight %}

<script type="text/javascript">
(function () {
  var chart = createPlotArea(dataSeries1, '#example_bollinger');

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

  // Create the Bollinger bands component
  var bollinger = fc.indicators.bollingerBands()
    .xScale(chart.dateScale)
    .yScale(chart.priceScale)
    .movingAverage(10)
    .standardDeviations(2);

  // Add it to the chart
  chart.plotArea.append('g')
    .attr('class', 'bollinger-band')
    .datum(dataSeries1)
    .call(bollinger);
}());
</script>
