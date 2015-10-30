---
layout: component
title: Moving Average
component: indicator/algorithm/movingAverage.js
tags:
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

  // Create and apply the Moving Average
  var movingAverage = fc.indicator.algorithm.movingAverage()
  movingAverage(data);

  // Create a line that renders the result
  var ma = fc.series.line()
      .yValue(function(d) { return d.movingAverage; })
      .xScale(xScale)
      .yScale(yScale);

  // Add it to the container
  container.append('g')
      .datum(data)
      .call(ma);
---

A [moving average](http://en.wikipedia.org/wiki/Moving_average) is an indicator that smooths out fluctuations in data. This component computes a [simple moving average](http://en.wikipedia.org/wiki/Moving_average#Simple_moving_average) for a given data field, averaging the previous 5 points by default.

D3FC indicators are comprised of two component parts:

 + The indicator algorithm, which is applied to the input data. The algorithm computes the indicator and merges the result back into the source data (although this behaviour is configurable).
 + An optional indicator renderer, that converts the algorithm output into one or more series / annotations.

Simpler indicators do not require renderer with their output readily rendered via a simple series.

The example below creates a point series and a moving average:

```js
{{{example-code}}}
```

{{>example-fixture}}

You can configure the number of datapoints that are included in the moving average via the `windowSize` property, you can also change the object property that is averaged via the `yValue` property.
