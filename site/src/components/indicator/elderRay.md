---
layout: component
title: Elder Ray
component: indicator/algorithm/elderRay.js
tags:
  - frontpage
  - playground 
namespace: indicator

example-code: |
  // Create and apply the elder ray algorithm
  var elderRayAlgorithm = fc.indicator.algorithm.elderRay().period(6);
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

An [Elder Ray](http://www.investopedia.com/articles/trading/03/022603.asp) indicator is defined as two separate indicators:

`Bull Power = Daily High - n-period Exponential Moving Average (EMA)`

`Bear Power = Daily Low - n-period EMA`

where the n-period defaults to 13 days.

To change the n-period the `period` property can be used on the algorithm as shown.

The following is an example of the Elder Ray indicator. 

```js
{{{example-code}}}
```

Which yields the following :

{{>example-fixture}}
