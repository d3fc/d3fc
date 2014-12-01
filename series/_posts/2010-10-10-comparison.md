---
layout: default
title: Comparison
---

Comparison charts, as their name suggests, are great for comparing the percentage price change of multiple stocks in time. This component plots the percentage change of the close prices for each named series.

<div id="example_comparison" class="chart"> </div>

<div class="tabs">
  <div>
    <h4>JavaScript</h4>
<pre>
// Create the Comparison series
var comparison = fc.series.comparison()
  .xScale(chart.dateScale)
  .yScale(chart.priceScale);

// Add the primary OHLC series
chart.plotArea.selectAll('.series').remove();
chart.plotArea.append('g')
  .attr('class', 'series')
  .datum(data)
  .call(comparison);
</pre>
  </div>
  <div>
    <h4>Data structure (JS)</h4>
<pre>
var data = [
  {
    name: "Series 1",
    data: fc.utilities.dataGenerator()
      .fromDate(fromDate)
      .toDate(toDate)
      .generate()
  },
  {
    name: "Series 2",
    data: fc.utilities.dataGenerator()
      .fromDate(fromDate)
      .toDate(toDate)
      .generate()
  },
  {
    name: "Series 3",
    data: fc.utilities.dataGenerator()
      .fromDate(fromDate)
      .toDate(toDate)
      .generate()
  }
];
</pre>
  </div>
  <div>
    <h4>CSS</h4>
<pre>
.line { 
  fill: none; 
}
</pre>
  </div>
  <div>
    <h4>SVG</h4>
<xmp>
<g class="comparison-series">
  <path class="line"></path>
  <path class="line"></path>
  <path class="line"></path>
</g>
</xmp>
  </div>
</div>

<script type="text/javascript">
  var chart = createPlotArea(dataSeries1, '#example_comparison', false, true);

  var data = [ 
  	{ name: 'Series 1', data: dataSeries1 }, 
  	{ name: 'Series 2', data: dataSeries2 },
  	{ name: 'Series 3', data: dataSeries3 }
  ];

  // Create the Comparison series
  var comparison = fc.series.comparison()
    .xScale(chart.dateScale)
    .yScale(chart.priceScale);

  // Add the primary Comparison series
  chart.plotArea.selectAll('.series').remove();
  chart.plotArea.append('g')
    .attr('class', 'series')
    .datum(data)
    .call(comparison);
</script>
