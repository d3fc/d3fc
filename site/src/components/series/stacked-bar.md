---
layout: component
title: Stacked Bar Series
component: series/stackedBar.js
tags:
  - frontpage
namespace: series

example-code: |
  var data = [
   {"State":"AL","Under 5 Years":"310","5 to 13 Years":"552","14 to 17 Years":"259","18 to 24 Years":"450","25 to 44 Years":"1215","45 to 64 Years":"641"},
   {"State":"AK","Under 5 Years":"52","5 to 13 Years":"85","14 to 17 Years":"42","18 to 24 Years":"74","25 to 44 Years":"183","45 to 64 Years":"50"},
   {"State":"AZ","Under 5 Years":"515","5 to 13 Years":"828","14 to 17 Years":"362","18 to 24 Years":"601","25 to 44 Years":"1804","45 to 64 Years":"1523"},
   {"State":"AR","Under 5 Years":"202","5 to 13 Years":"343","14 to 17 Years":"157","18 to 24 Years":"264","25 to 44 Years":"754","45 to 64 Years":"727"},
   {"State":"CO","Under 5 Years":"358","5 to 13 Years":"587","14 to 17 Years":"261","18 to 24 Years":"466","25 to 44 Years":"1464","45 to 64 Years":"1290"},
   {"State":"CT","Under 5 Years":"211","5 to 13 Years":"403","14 to 17 Years":"196","18 to 24 Years":"325","25 to 44 Years":"916","45 to 64 Years":"968"},
   {"State":"DE","Under 5 Years":"59","5 to 13 Years":"99","14 to 17 Years":"47","18 to 24 Years":"84","25 to 44 Years":"230","45 to 64 Years":"230"}
  ];

  // Transform the data into a number of distinct series, one for each category of data
  var series = Object.keys(data[0])
      .filter(function(key) {
          return key !== 'State';
      })
      .map(function(key) {
          return {
              name: key,
              data: data.map(function(d) {
                return {
                  state: d.State,
                  value: parseInt(d[key])
                };
              })
          };
      });

  var stackLayout = d3.layout.stack()
      .offset('zero')
      .x(function(d) { return d.state; })
      .y(function(d) { return d.value; });

  var stackedData = stackLayout(series.map(function(d) { return d.data; }));

  var xCategories = data.map(function(d) { return d.State; });

  // create scales
  var x = d3.scale.ordinal()
      .domain(xCategories)
      .rangePoints([0, width], 1);

  var color = d3.scale.category10();

  var y = d3.scale.linear()
    .domain([0, 6000])
    .range([height, 0]);

  var stack = fc.series.stacked.bar()
    .xScale(x)
    .yScale(y)
    .xValue(function(d) { return d.state; })
    .decorate(function(sel, index) {
        sel.select('path')
            .style('fill', color(index));
    });

  container.append('g')
      .datum(stackedData)
      .call(stack);
---

The stacked bar series renders multiple series of data in a stacked form. The data needs to be presented to the component as multiple distinct series, where each datapoint exposes a `y` and `y0` property, where the `y0` property indicates the offset required to stack the series. The easiest way to add the required offset to a series is via the `d3.layout.stack` component.

The following example shows how to manipulate some data into the required form, then configures the bar series accordingly:

```js
{{{example-code}}}
```

Which gives the following:

{{>example-fixture}}




