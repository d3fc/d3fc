---
layout: default
title: Chart Layout
---

Based on the [Margin Convention](http://bl.ocks.org/mbostock/3019563), the chart layout component is responsible for defining the chart area.

It attempts to simplify the repetitive process of constructing the chart area:

+ Define the margins, height and width
+ Calculate the inner height and inner width
+ Create an SVG
+ Create a group for all chart elements; translate it based on the margins
+ Create a clipping path for the plot area; add it to the group

<div id="example_chartLayout" class="chart"> </div>

#### JavaScript

{% highlight javascript %}
var chartLayout = fc.utilities.chartLayout()
  .marginTop(10)
  .marginBottom(30)
  .marginLeft(40)
  .marginRight(40);

// The overall chart
d3.select(name)
  .call(chartLayout);
{% endhighlight %}

#### CSS

{% highlight css %}
.chartArea rect.background {
  stroke: #eee;
  fill: #fefefe;
}
{% endhighlight %}

#### SVG Output

{% highlight html %}
<svg class="chartArea">
  <g>
    <defs>
      <clipPath id="plotAreaClip">
        <rect></rect>
      </clipPath>
    </defs>
    <g clip-path="url(#plotAreaClip)" class="plotArea"></g>
  </g>
</svg>
{% endhighlight %}

<script type="text/javascript">
(function(){
  var chart = createPlotArea(dataSeries1, '#example_chartLayout');

  // Create the OHLC series
  var ohlc = fc.series.ohlc()
    .xScale(chart.dateScale)
    .yScale(chart.priceScale);

  // Add the primary OHLC series
  chart.plotArea
    .datum(dataSeries1)
    .call(ohlc);
}());
</script>
