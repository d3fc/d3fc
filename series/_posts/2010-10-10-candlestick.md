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
	var data = fc.utilities.dataGenerator()
		.fromDate(new Date(2014, 1, 1))
		.toDate(new Date(2014, 3, 1))
		.generate();

	// Setup the chartLayout
	var chartLayout = fc.utilities.chartLayout()
		.marginBottom(30)
		.marginLeft(10)
		.marginRight(40);

	// The overall chart
	var setupArea = d3
		.select('#example_candlestick')
		.call(chartLayout);

	// Select the elements which we'll want to add other elements to
	var svg = setupArea.select('svg'),
		chart = svg.select('g'),
		plotArea = chart.select('.plotArea');

	// Style the svg with a CSS class
	svg.attr('class', 'fcChartArea');

	// Calculate the scales from the data
	var chartScale = {
		dateFrom: new Date(d3.min(data, function (d) { return d.date; }).getTime() - 8.64e7),
		dateTo: new Date(d3.max(data, function (d) { return d.date; }).getTime() + 8.64e7),
		priceFrom: d3.min(data, function (d) { return d.low; }),
		priceTo: d3.max(data, function (d) { return d.high; }),
	};

	var dateScale = fc.scale.finance()
		.domain([chartScale.dateFrom, chartScale.dateTo])
		.range([0, chartLayout.innerWidth()]);

	var priceScale = d3.scale.linear()
		.domain([chartScale.priceFrom, chartScale.priceTo])
		.nice()
		.range([chartLayout.innerHeight(), 0]);

	// Create the axes
	var dateAxis = d3.svg.axis()
		.scale(dateScale)
		.orient('bottom')
		.ticks(5);

	var priceAxis = d3.svg.axis()
		.scale(priceScale)
		.orient('right')
		.ticks(5);

	// Add the axes to the chart
	chart.append('g')
		.attr('class', 'axis date')
		.attr('transform', 'translate(0,' + chartLayout.innerHeight() + ')')
		.call(dateAxis);

	chart.append('g')
		.attr('class', 'axis price')
		.attr('transform', 'translate(' + chartLayout.innerWidth() + ',0)')
		.call(priceAxis);

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
</script>

{% include tabs.html %}
