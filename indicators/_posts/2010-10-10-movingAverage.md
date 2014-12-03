---
layout: default
title: Moving Average
---

This component draws a line on a chart which follows the value of a given data field, optionally applying a moving average calculation.

<div id="example_movingAverage" class="chart"> </div>

<div class="tabs">
  <div>
    <h4>JavaScript</h4>
<pre>
// Create the moving average tracker
var tracker = fc.indicators.movingAverage()
  .xScale(chart.dateScale)
  .yScale(chart.priceScale)
  .yValue('close')
  .averagePoints(10);

// Add it to the chart
chart.plotArea.append('g')
  .attr('class', 'moving-average')
  .datum(dataSeries1)
  .call(tracker);
</pre>
  </div>
  <div>
    <h4>CSS</h4>
<pre>
.moving-average {
  fill: none;
  stroke: #69f;
  stroke-width: 1;
  stroke-dasharray: 3, 3;
}
</pre>
  </div>
  <div>
    <h4>SVG</h4>
<xmp>
<g class="moving-average">
  <path class="indicator"></path>
</g>
</xmp>
  </div>
</div>

<script type="text/javascript">
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
    .yValue('close')
    .averagePoints(10);

  // Add it to the chart
  chart.plotArea.append('g')
    .attr('class', 'moving-average')
    .datum(dataSeries1)
    .call(tracker);
</script>
