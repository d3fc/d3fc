---
layout: component
title: Elder Ray
component: indicator/algorithm/elderRay.js
tags:
  - playground
namespace: indicator

example-code: |
  // Create and apply the elder ray algorithm
  var elderRayAlgorithm = fc.indicator.algorithm.elderRay()
      .period(6);
  elderRayAlgorithm(data);

  // the elder ray is rendered on its own scale
  var yScale = d3.scale.linear()
      .domain([-5, 5])
      .range([height, 0]);

  // Create the renderer
  var elderRay = fc.indicator.renderer.elderRay()
      .xScale(xScale)
      .yScale(yScale);

  // Add it to the container
  container.append('g')
      .datum(data)
      .call(elderRay);
---

An [Elder Ray](http://www.investopedia.com/articles/trading/03/022603.asp) indicator is composed of two distinct series:

`Bull Power = Daily High - n-period Exponential Moving Average (EMA)`

`Bear Power = Daily Low - n-period EMA`

Where the n-period defaults to 13 days.

The following shows the Elder Ray in action, where the bull and bear power series are both rendered on the same chart:

```js
{{{example-code}}}
```

Which yields the following:

{{>example-fixture}}
