---
layout: default
title: Moving Average
component: indicators/movingAverage.js

example-code: |
  // Create the point series
  var point = fc.series.point()
      .xScale(xScale)
      .yScale(yScale);

  container.append('g')
      .datum(data)
      .call(point);

  // Create the moving average component
  var movingAverage = fc.indicators.movingAverage()
      .xScale(xScale)
      .yScale(yScale);

  // Add it to the container
  container.append('g')
      .datum(data)
      .call(movingAverage);
---

A [moving average](http://en.wikipedia.org/wiki/Moving_average) is an indicator that smooths out fluctuations in data. This component draws a [simple moving average](http://en.wikipedia.org/wiki/Moving_average#Simple_moving_average) line on a chart for a given data field, averaging the previous 5 points by default.

The example below creates a point series and a moving average:

{% highlight javascript %}
{{ page.example-code }}
{% endhighlight %}

<div id="indicators_movingAverage" class="chart"> </div>
<script type="text/javascript">
(function() {
    var f = createFixture('#indicators_movingAverage');
    var container = f.container, data = f.data
      xScale = f.xScale, yScale = f.yScale;

    {{ page.example-code }}
}());
</script>

You can configure the number of datapoints that are included in the moving average via the `windowSize` property, you can also change the object property that is averaged via the `yValue` property.


