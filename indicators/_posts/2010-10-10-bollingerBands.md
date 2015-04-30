---
layout: default
title: Bollinger Bands
component: indicators/bollingerBands.js

example-code: |
  // Create the point series
  var point = fc.series.point()
      .xScale(xScale)
      .yScale(yScale);

  container.append('g')
      .datum(data)
      .call(point);

  // Create the bollinger component
  var bollinger = fc.indicators.bollingerBands()
      .xScale(xScale)
      .yScale(yScale);

  // Add it to the container
  container.append('g')
      .datum(data)
      .call(bollinger);
---

[Bollinger bands](http://en.wikipedia.org/wiki/Bollinger_Bands) are an indicator that combine an n-point moving average with upper and lower bands that are positioned k-times an n-point standard deviation around the average.

The example below creates a point series and a bollinger band indicator:

{% highlight javascript %}
{{ page.example-code }}
{% endhighlight %}

<div id="indicators_bollinger" class="chart"> </div>
<script type="text/javascript">
(function() {
    var f = createFixture('#indicators_bollinger');
    var container = f.container, data = f.data
      xScale = f.xScale, yScale = f.yScale;

    {{ page.example-code }}
}());
</script>



