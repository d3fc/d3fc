---
layout: component
title: Error Bar Series
component: series/errorBar.js
tags:
  - frontpage
namespace: series

example-code: |
  var point = fc.series.point()
      .xScale(xScale)
      .yScale(yScale);
  
  container.append('g')
      .datum(data)
      .call(point);
  
  //Generating the error information for the data
  data.forEach(function(d) {
      d.yUpError = Math.random() * 2;
      d.yDownError = Math.random() * 2;
  });

  var eBar = fc.series.errorBar()
      .xScale(xScale)
      .yScale(yScale)
      .yLow(function(d,i) {return d.close - d.yDownError;})
      .yHigh(function(d,i) {return d.close + d.yUpError;})
      .yValue(function(d,i) {return d.close;});

  container.append('g')
      .datum(data)
      .call(eBar);
---

An [error bar series](http://en.wikipedia.org/wiki/Error_bar) renders the error or uncertainty area around given
values. These can be in x or y dimension. To get the bars rendered, `Low` or `High` values should be supplied using
`xLow`, `xHigh`, `yLow`, `yHigh` properties of the series. 

```js
{{{example-code}}}
```

Which gives the following:

{{>example-fixture}}
