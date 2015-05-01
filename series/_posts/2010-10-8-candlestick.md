---
layout: default
title: Candlestick Series
component: series/candlestick.js

example-code: |
  var candlestick = fc.series.candlestick()
      .xScale(xScale)
      .yScale(yScale);

  container.append('g')
      .datum(data)
      .call(candlestick);
---

A [candlestick series](http://en.wikipedia.org/wiki/Candlestick_chart) renders the open, high, low and close values for each bucketed time period:

{% highlight javascript %}
{{ page.example-code }}
{% endhighlight %}

Which gives the following:

<div id="series_candlestick" class="chart"> </div>
<script type="text/javascript">
(function() {
    var f = createFixture('#series_candlestick', null, null, function() { return true; });
    var container = f.container, data = f.data
      xScale = f.xScale, yScale = f.yScale;
    {{ page.example-code }}
}());
</script>

You can configure how the series obtains the high, low, open close values via the `yOpenValue`, `yHighValue`, `yLowValue` and `yCloseValue` properties. You can configure the width of each candlestick via the `barWidth` property, and also modify how they are rendered via the `decorate` property.


