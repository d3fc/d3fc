---
layout: component
title: Bollinger Bands
component: indicator/algorithm/bollingerBands.js
tags:
  - frontpage
  - playground
namespace: indicator

example-code: |
  // Create the point series
  var point = fc.series.point()
      .xScale(xScale)
      .yScale(yScale);

  container.append('g')
      .datum(data)
      .call(point);

  // Create and apply the bollinger algorithm
  var bollingerAlgorithm = fc.indicator.algorithm.bollingerBands();
  bollingerAlgorithm(data);

  // Create the renderer
  var bollinger = fc.indicator.renderer.bollingerBands()
      .xScale(xScale)
      .yScale(yScale);

  // Add it to the container
  container.append('g')
      .datum(data)
      .call(bollinger);
---

[Bollinger bands](http://en.wikipedia.org/wiki/Bollinger_Bands) are an indicator that combine an n-point moving average with upper and lower bands that are positioned k-times an n-point standard deviation around the average.

The example below creates a point series and a bollinger band indicator:

```js
{{{example-code}}}
```

{{>example-fixture}}
