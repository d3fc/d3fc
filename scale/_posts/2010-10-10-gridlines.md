---
layout: default
title: Grid lines
---

This component draws gridlines on the chart based on the chart scales tick positions unless new tick positions are specified using the xTicks and yTicks properties.

<div id="example_gridlines" class="chart"> </div>

#### JavaScript

{% highlight javascript %}
// Create the gridlines component
var gridlines = fc.scale.gridlines()
  .xScale(xScale)
  .yScale(yScale)
  .xTicks(10);

// Add gridlines to the chart area
chart.plotArea.call(gridlines);
{% endhighlight %}

#### CSS

{% highlight css %}
.gridlines {
  stroke: #ccc;
  stroke-width: 1.0;
}
{% endhighlight %}

#### SVG Output

{% highlight html %}
<g class="gridlines">
  <line class="x"></line>
  <line class="y"></line>
</g>
{% endhighlight %}

<script type="text/javascript">
(function(){
  var chart = createPlotArea(dataSeries1, '#example_gridlines');

  // Create the gridlines component
  var gridlines = fc.scale.gridlines()
    .xScale(chart.dateScale)
    .yScale(chart.priceScale)
    .xTicks(10);

  // Add gridlines to the chart area
  chart.plotArea.call(gridlines);
}());
</script>
