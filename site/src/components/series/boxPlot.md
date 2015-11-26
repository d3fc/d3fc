---
layout: component
title: Box Plot Series
component: series/boxPlot.js
tags:
  - playground
namespace: series

example-code: |
  //Generating the boxPlot information for the data
  data.forEach(function(d) {
      d.yUpBox = Math.random() * 2;
      d.yDownBox = Math.random() * 2;
      d.yUpWhisker = d.yUpBox + Math.random() * 2;
      d.yDownWhisker = d.yDownBox +  Math.random() * 2;
  });

  var boxPlot = fc.series.boxPlot()
      .xScale(xScale)
      .yScale(yScale)
      .boxLow(function(d,i) { return d.close - d.yDownBox; })
      .boxHigh(function(d,i) { return d.close + d.yUpBox; })
      .whiskerLow(function(d,i) { return d.close - d.yDownWhisker; })
      .whiskerHigh(function(d,i) { return d.close + d.yUpWhisker; });

  container.append('g')
      .datum(data)
      .call(boxPlot);

---

A [box plot series](https://en.wikipedia.org/wiki/Box_plot) is a convenient way of graphically depicting groups of 
numerical data through their quartiles. Boxes can be renderer vertically or horizontally based on the value of the `orient` property.

The upper and lower end of each box are defined by the `boxUpper` and `boxLower` properties.
The upper and lower whisker of each box are defined by the `whiskerUpper` and `whiskerLower` properties.

The following example generates a random box plot around each datapoint:

```js
{{{example-code}}}
```

Which gives the following:

{{>example-fixture}}
