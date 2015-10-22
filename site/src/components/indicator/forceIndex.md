---
layout: component
title: Force Index
component: indicator/algorithm/forceIndex.js
tags:
namespace: indicator

example-code: |
  // Create and apply the Force Index algorithm
  var forceAlgorithm = fc.indicator.algorithm.forceIndex();
  forceAlgorithm(data);
  
  // Calculate the maximum absolute value of the index
  var absoluteMax = d3.max(data, function(d) { return Math.abs(d.force); })
  
  //Scaling the display using the maximum absolute value of the Index
  var yScale = d3.scale.linear()
      .domain([-absoluteMax, absoluteMax])
      .range([height, 0]).nice();

  // Create the renderer
  var force = fc.indicator.renderer.forceIndex()
      .xScale(xScale)
      .yScale(yScale);

  // Add it to the container
  container.append('g')
      .datum(data)
      .call(force);
---

A [Force Index](http://en.wikipedia.org/wiki/Force_index) is an indicator that illustrates how strong the actual buying
or selling pressure is. It is calculated by subtracting today's closing price from yesterday's and
multiplying the result by today's volume. The 13 day [Exponential Moving Average](/components/indicator/exponentialMovingAverage) 
of the Force Index is often used. The Force Index is typically plotted on a chart centered around the 0 line.
Attention is given to the relative size and trends in the Index.

The Force Index rendered on a linear scale:

```js
{{{example-code}}}
```

{{>example-fixture}}
