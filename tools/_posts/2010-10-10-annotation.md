---
layout: default
title: Annotations
---

This component draws a horizontal marker on the chart at a given yValue. the marker has a label and can be styled using CSS.

<div id="example_annotation" class="chart"> </div>

#### JavaScript

{% highlight javascript %}
// Create the annotation
var annotation = fc.tools.annotation()
  .xScale(chart.dateScale)
  .yScale(chart.priceScale)
  .yValue(100)
  .yLabel('Annotation')
  .formatCallout(function(d) { return d3.format('.1f')(d); });

// Add it to the chart
chart.plotArea.call(annotation);
{% endhighlight %}

#### CSS

{% highlight css %}
.annotation .marker {
  fill: none;
  stroke: #69f;
  stroke-width: 1;
  stroke-dasharray: 3, 3;
}
.annotation .callout {
  font: 10px sans-serif;
}
{% endhighlight %}

#### SVG Output

{% highlight html %}
<g class="annotation">
	<line class="marker"></line>
	<text class="callout"></text>
</g>
{% endhighlight %}

<script type="text/javascript">
(function(){
  var chart = createPlotArea(dataSeries1, '#example_annotation');

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

  var min = d3.min(dataSeries1, function (d) { return d.low; }),
	  max = d3.max(dataSeries1, function (d) { return d.high; }),
	  mid = min + ((max-min)/2.0);

  // Create the annotation
  var annotation = fc.tools.annotation()
    .xScale(chart.dateScale)
    .yScale(chart.priceScale)
    .yValue(mid)
    .yLabel('Annotation:')
    .formatCallout(function(d) { return d3.format('.1f')(d); });

  // Add it to the chart
  chart.plotArea.call(annotation);
}());
</script>
