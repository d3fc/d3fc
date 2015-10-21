---
layout: component
title: Force Index
component: indicator/algorithm/forceIndex.js
tags:
namespace: indicator

example-code: |

  // Create and apply the RSI algorithm
  var forceAlgorithm = fc.indicator.algorithm.forceIndex();
  forceAlgorithm(data);
  
  var aboluteMax = Math.max(Math.abs(d3.min(data, function(d) { return d.force; })),
    d3.max(data, function(d) { return d.force; }));
  
  var yScale = d3.scale.linear()
          .domain([-aboluteMax, aboluteMax])
          .range([height - 10, 10]);

  // Create the renderer
  var force = fc.indicator.renderer.forceIndex()
      .xScale(xScale)
      .yScale(yScale);

  // Add it to the container
  container.append('g')
      .datum(data)
      .call(force);
---

A [Relative Strength Index](http://en.wikipedia.org/wiki/Relative_strength_index) is an indicator that plots the historical strength or weakness of a stock based on opening and closing prices. It is typically plotted on a 14-day timeframe and is displayed next to overbought (70%) and oversold lines (30%) lines.

The RSI indicator is rendered on a percent scale:

```js
{{{example-code}}}
```

{{>example-fixture}}

You can configure the number of datapoints that are included in the RSI via the `windowSize` property, you can also change how the open and close values are read via the `openValue` and `closeValue` properties.


