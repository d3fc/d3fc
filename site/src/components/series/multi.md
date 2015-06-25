---
layout: component
title: Multi Series
component: series/multi.js
tags:
  - frontpage
namespace: series

example-code: |
  var candlestick = fc.series.candlestick();
  var gridlines = fc.annotation.gridline();

  // Create a a bollinger series
  var bollingerAlgorithm = fc.indicator.algorithm.bollingerBands();
  bollingerAlgorithm(data);
  var bollinger = fc.indicator.renderer.bollingerBands();

  var multi = fc.series.multi()
      .series([gridlines, candlestick, bollinger])
      .xScale(xScale)
      .yScale(yScale);

  container.append('g')
      .datum(data)
      .call(multi);
---

The multi series component makes it easier to render a number of components that share the same x and y scales. The following example shows the candlestick, bollinger and gridlines components rendered via the multi series:

```js
{{{example-code}}}
```

Which gives the following:

{{>example-fixture}}



