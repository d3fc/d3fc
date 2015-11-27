---
layout: component
title: Waterfall Series
component: series/waterfall.js
tags:
  - playground
namespace: series

example-code: |
  var data = [
    { month: 'January', profit: 4000 },  
    { month: 'February', profit: 2000 },
    { month: 'March', profit: -1000 },
    { month: 'April', profit: 1500 },
    { month: 'May', profit: 100 },
    { month: 'June', profit: 500 },
    { month: 'July', profit: -100 },
    { month: 'August', profit: 800 },
    { month: 'September', profit: 1200 },
    { month: 'October', profit: 1500 },
    { month: 'November', profit: 1400 },
    { month: 'December', profit: 2000 }
  ];

  var waterfallData = fc.series.algorithm.waterfall()
      .xValueKey('month')
      .yValue(function(d) { return d.profit; })
      .startsWithTotal(true)
      .total(function(d, i, data) {
          if ((i + 1) % 3 === 0) {
              return 'Q' + ((i + 1) / 3) + ' total';
          }
      })(data);

  var xScale = d3.scale.ordinal()
      .domain(waterfallData.map(function(d) { return d.x; }))    
      .rangeRoundBands([0, width], 0.1);
  yScale.domain(fc.util.extent().fields('y1').pad(0.2).include(0)(waterfallData));

  var waterfall = fc.series.waterfall()
      .xScale(xScale)
      .yScale(yScale);

  container.append('g')
      .datum(waterfallData)
      .call(waterfall);
---

The [Waterfall series](https://en.wikipedia.org/wiki/Waterfall_chart) renders the given data as a series of vertical bars, showing the cumulative effect of each bar. The series begins and ends with the total values.

All bars are classed with 'waterfall'. Ascending and descending bars are classed with 'up' and 'down' respectively.

The data must be shaped using `fc.series.algorithm.waterfall()`. The new data has a `x` property specifying the x-location, `y0` and `y1` properties specifying the y0 and y1-locations respectively, and a `direction`. The algorithm assumes each object has an `x` property which defines its x-location, and a `y` property which defines its y-location. However, these can be changed via the `xValueKey` and `yValue` properties.

The first column can be declared as a total by using the `startsWithTotal` property. Other total columns can be inserted into the data by using the algorithm's `totals` property. For a given datapoint this property should return the x-location for the total bar to be inserted. If the `totals` are not specified a final total bar will be inserted by default.

```js
{{{example-code}}}
```

Which gives the following:

{{>example-fixture}}

The data that identifies the x-value is identified via the `xValueKey` property.

This series has the same `yValue` and `decorate` properties as the [point series](./point). You can also specify the width of the bars via the `barWidth` property.

The waterfall series supports horizontal display, using the `orient` property, similar to [bar](./bar).