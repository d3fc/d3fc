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
  .xScale(xScale)
  .yScale(yScale)
  .movingAverage(10)
  .standardDeviations(2);

// Add it to the chart
chart.plotArea
  .datum(data)
  .call(bollinger);
{% endhighlight %}

#### CSS

{% highlight css %}
.band-area {
  fill: #ddd;
  stroke-width: 0;
  opacity: 0.5;
}

.band-upper, .band-lower {
  fill: none;
  stroke: #666;
  stroke-width: 1;
}
{% endhighlight %}

#### SVG Output

{% highlight html %}
<g class="bollinger-series">
  <path d="..." class="band-area"></path>
  <path d="..." class="band-upper"></path>
  <path d="..." class="band-lower"></path>
  <path d="..." class="moving-average"></path>
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
  chart.plotArea
    .datum(dataSeries1)
    .call(bollinger);
}());
</script>
