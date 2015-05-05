---
layout: default
title: Bollinger Bands
component: indicators/bollingerBands.js
tags:
  - frontpage

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

{% include exampleFixture.html %}



