---
layout: component
title: Candlestick Series
component: series/candlestick.js
tags:
namespace: series

example-code: |
  var candlestick = fc.series.candlestick()
      .xScale(xScale)
      .yScale(yScale);

  container.append('g')
      .datum(data)
      .call(candlestick);
---

A [candlestick series](http://en.wikipedia.org/wiki/Candlestick_chart) renders the open, high, low and close values for each bucketed time period:

```js
{{{example-code}}}
```

Which gives the following:

{{>example-fixture}}

You can configure how the series obtains the high, low, open close values via the `yOpenValue`, `yHighValue`, `yLowValue` and `yCloseValue` properties. You can configure the width of each candlestick via the `barWidth` property, and also modify how they are rendered via the `decorate` property.


