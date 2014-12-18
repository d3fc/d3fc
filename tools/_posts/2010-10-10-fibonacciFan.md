---
layout: default
title: Fibonacci Fan
---

This component allows the user to draw a Fibonacci fan onto a chart.
For a Fibonacci fan, a trend line is drawn between two points, then three fan lines are drawn from the leftmost point to the rightmost edge of the chart at gradients of 38.2%, 50% and 61.8% of the trend line's gradient.
When added, the component exists in one of three phases:

* In the first phase, a circle is drawn around the data point closest to the mouse (the **origin**); a mouse click advances the component to the next phase.
* In the second phase, a second circle is drawn around the data point closest to the mouse (the **target**) and a trend line is drawn between it and the origin point; a mouse click advances the component to the final phase.
* In the final phase, the three fan lines are drawn from the origin point to the edge of the chart; a mouse click hides the fan and returns the component to the first phase.

<div id="example_fibonaccifan" class="chart"> </div>

#### JavaScript

{% highlight javascript %}
// Create an invisible overlay
var overlay = d3.svg.area()
  .x(function (d) { return chart.dateScale(d.date); })
  .y0(0)
  .y1(chart.layout.innerHeight());

// Create the fan component
var fibonacci = fc.tools.fibonacciFan()
  .target(chart.plotArea)
  .series(dataSeries1)
  .xScale(chart.dateScale)
  .yScale(chart.priceScale);

// Add the fan on top of the overlay
chart.plotArea.append('path')
  .attr('class', 'overlay')
  .attr('d', overlay(dataSeries1))
  .call(fibonacci);
{% endhighlight %}

#### CSS

{% highlight css %}
.fibonacci-fan {
  fill: none;
  stroke: grey;
  stroke-width: 1;
  stroke-opacity: 0.5;
}
.fibonacci-fan.source {
  stroke: blue;
  stroke-width: 1.5;
}
.fibonacci-fan.b {
  stroke-opacity: 0.4;
}
circle.fibonacci-fan {
  fill: none;
  stroke: blue;
  stroke-width: 1;
  stroke-opacity: 0.5;
}
.fibonacci-fan.area {
  fill: lightgrey;
  fill-opacity: 0.5;
  stroke-width: 0;
}
{% endhighlight %}

#### SVG Output

{% highlight html %}
<g class="fibonacci-fan">
	<circle class="fibonacci-fan origin"></circle>
	<circle class="fibonacci-fan target"></circle>
	<line class="fibonacci-fan source"></line>
	<line class="fibonacci-fan a"></line>
	<line class="fibonacci-fan b"></line>
	<line class="fibonacci-fan c"></line>
	<polygon class="fibonacci-fan area"></polygon>
</g>
{% endhighlight %}

<script type="text/javascript">
(function(){
  var chart = createPlotArea(dataSeries1, '#example_fibonaccifan');

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

  // Create an invisible overlay
  var overlay = d3.svg.area()
    .x(function (d) { return chart.dateScale(d.date); })
    .y0(0)
    .y1(chart.layout.innerHeight());

  // Create the fan component
  var fibonacci = fc.tools.fibonacciFan()
    .target(chart.plotArea)
    .series(dataSeries1)
    .xScale(chart.dateScale)
    .yScale(chart.priceScale);

  // Add the fan on top of the overlay
  chart.plotArea.append('path')
    .attr('class', 'overlay')
    .attr('d', overlay(dataSeries1))
    .call(fibonacci);
}());
</script>
