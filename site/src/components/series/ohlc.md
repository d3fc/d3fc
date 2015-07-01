---
layout: component
title: OHLC Series
component: series/ohlc.js
tags:
namespace: series

example-code: |
  var ohlc = fc.series.ohlc()
      .xScale(xScale)
      .yScale(yScale);

  container.append('g')
      .datum(data)
      .call(ohlc);
---

An [open-high-low-close (OHLC) series](http://en.wikipedia.org/wiki/Open-high-low-close_chart) renders the open, high, low and close values for each bucketed time period:

```js
{{{example-code}}}
```

Which gives the following:

{{>example-fixture}}

The OHLC series shares the same configuration options as the [candlestick series](#candlestick).


