---
layout: default
title: Candlestick
javascript: |
	// Create the Candlestick series
	var candlestick = fc.series.candlestick()
		.xScale(dateScale)
		.yScale(priceScale);

	// Add the primary Candlestick series
	plotArea.selectAll('.series').remove();
	plotArea.append('g')
		.attr('class', 'series')
		.datum(data)
		.call(candlestick);
css: |
	.bar path { stroke-width: 1.5; }
	.bar.up-day path { stroke: #6c0; }
	.bar.down-day path { stroke: #c60; }
	.bar.up-day rect { fill: #6c0; }
	.bar.down-day rect { fill: #c60; }
html: |
	<g class="candlestick-series">
	  <g class="bar down-day">
	      <path class="high-low-line"></path>
	      <rect></rect>
	  </g>
	  <g class="bar up-day">
	      <path class="high-low-line"></path>
	      <rect></rect>
	  </g>
	</g>
---

This component calculates and draws a candlestick data series, the series shows high, low, open and close values on the Y axis against Date/Time on the X axis. The series can be styled using CSS to represent market gains or market losses.

<div id="example_candlestick"> </div>

<script type="text/javascript">
	// Mock data generation (mu, sigma, startingPrice, intraDaySteps, filter)
	var plotArea = createPlotArea();

	// Create the Candlestick series
	var candlestick = fc.series.candlestick()
		.xScale(dateScale)
		.yScale(priceScale);

	// Add the primary Candlestick series
	plotArea.selectAll('.series').remove();
	plotArea.append('g')
		.attr('class', 'series')
		.datum(dataSeries1)
		.call(candlestick);
</script>

{% include tabs.html %}
