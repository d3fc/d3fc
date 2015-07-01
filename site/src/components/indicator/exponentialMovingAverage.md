---
layout: component
title: Exponential Moving Average
component: indicator/algorithm/exponentialMovingAverage.js
tags:
namespace: indicator

example-code: |
  // Create the point series
  var point = fc.series.point()
      .xScale(xScale)
      .yScale(yScale);

  container.append('g')
      .datum(data)
      .call(point);

  // Create and apply the EMA
  var movingAverage = fc.indicator.algorithm.exponentialMovingAverage()
  movingAverage(data);

  // Create a line that renders the result
  var ma = fc.series.line()
      .yValue(function(d) { return d.exponentialMovingAverage; })
      .xScale(xScale)
      .yScale(yScale);

  // Add it to the container
  container.append('g')
      .datum(data)
      .call(ma);
---

An [Exponential Moving Average](https://en.wikipedia.org/?title=Moving_average#Exponential_moving_average) (EMA) is an indicator that smooths out fluctuations in data.

The example below creates a point series and an EMA:

```js
{{{example-code}}}
```

{{>example-fixture}}

You can configure the number of datapoints that are included in the moving average via the `windowSize` property, you can also change the object property that is averaged via the `yValue` property.


