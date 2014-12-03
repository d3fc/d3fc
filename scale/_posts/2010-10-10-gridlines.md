---
layout: default
title: Grid lines
---

This component draws gridlines on the chart based on the chart scales tick positions unless new tick positions are specified using the xTicks and yTicks properties.

<div id="example_gridlines" class="chart"> </div>

<div class="tabs">
  <div>
    <h4>JavaScript</h4>
<pre>
// Create the gridlines component
var gridlines = fc.scale.gridlines()
  .xScale(chart.dateScale)
  .yScale(chart.priceScale)
  .xTicks(10);

// Add gridlines to the chart area
chart.plotArea.call(gridlines);
</pre>
  </div>
  <div>
    <h4>CSS</h4>
<pre>
.gridlines { 
	stroke: #ccc;
	stroke-width: 1.0;
}
.gridlines .x { 
}
.gridlines .y { 
}
</pre>
  </div>
  <div>
    <h4>SVG</h4>
<xmp>
<g class="gridlines">
  <line class="x"></line>	
  <line class="y"></line>
</g></xmp>
  </div>
</div>

<script type="text/javascript">
  var chart = createPlotArea(dataSeries1, '#example_gridlines');

  // Create the gridlines component
  var gridlines = fc.scale.gridlines()
    .xScale(chart.dateScale)
    .yScale(chart.priceScale)
    .xTicks(10);

  // Add gridlines to the chart area
  chart.plotArea.call(gridlines);
</script>
