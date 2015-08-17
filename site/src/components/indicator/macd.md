---
layout: component
title: MACD
component: indicator/algorithm/macd.js
tags:
  - frontpage
namespace: indicator

example-code: |

  // Create and apply the macd algorithm
  var macdAlgorithm = fc.indicator.algorithm.macd()
      .fastPeriod(4)
      .slowPeriod(10)
      .signalPeriod(5);
  macdAlgorithm(data);

  // the MACD is rendered on its own scale, centered around zero
  var maxExtent = d3.max(data, function(d) { return Math.abs(d.macd.macd); });
  var yScale = d3.scale.linear()
      .domain([-maxExtent, maxExtent])
      .range([height, 0]);

  // Create the renderer
  var macd = fc.indicator.renderer.macd()
      .xScale(xScale)
      .yScale(yScale);

  // Add it to the container
  container.append('g')
      .datum(data)
      .call(macd);
---

A [MACD](https://en.wikipedia.org/wiki/MACD) indicator (short for Moving Average Convergence / Divergence) is computed from the difference between a fast (short period) Exponential Moving Average (EMA) and a slow (long period) EMA. It is rendered against a signal line, which is an EMA of the MACD itself, and a bar chart that shows the difference between the two.

The following is a simple example of the MACD indicator, where the fast, slow and signal periods have been set explicitly (it is more typically used with the defaults of 12, 29 & 9).

```js
{{{example-code}}}
```

Which yields the following :

{{>example-fixture}}


