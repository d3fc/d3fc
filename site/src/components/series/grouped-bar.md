---
layout: component
title: Grouped Bar Series
component: series/groupedBar.js
tags:
  - frontpage
namespace: series

example-code: |
  var data = [
     {"State":"AL","Under 5 Years":"310","5 to 13 Years":"552","14 to 17 Years":"259","18 to 24 Years":"450","25 to 44 Years":"1215","45 to 64 Years":"641"},
     {"State":"AK","Under 5 Years":"52","5 to 13 Years":"85","14 to 17 Years":"42","18 to 24 Years":"74","25 to 44 Years":"183","45 to 64 Years":"50"},
     {"State":"AZ","Under 5 Years":"515","5 to 13 Years":"828","14 to 17 Years":"362","18 to 24 Years":"601","25 to 44 Years":"1804","45 to 64 Years":"1523"},
     {"State":"AR","Under 5 Years":"202","5 to 13 Years":"343","14 to 17 Years":"157","18 to 24 Years":"264","25 to 44 Years":"754","45 to 64 Years":"727"}
  ];

  // manipulate the data into stacked series
  var spread = fc.data.spread()
      .xValueKey('State');

  var series = spread(data);

  // create scales
  var x = d3.scale.ordinal()
      .domain(data.map(function(d) { return d.State; }))
      .rangePoints([0, width], 1);

  var yExtent = fc.util.extent()
      .fields('y')
      .include(0);

  var y = d3.scale.linear()
      .domain(yExtent(series.map(function(d) { return d.values; })))
      .range([height, 0]);

  // create the grouped bar series
  var groupedBar = fc.series.groupedBar()
      .xScale(x)
      .yScale(y)
      .xValue(function(d) { return d.x; })
      .yValue(function(d) { return d.y; });

  // render
  container.append('g')
      .datum(series)
      .call(groupedBar);
---

The grouped bar component renders multiple series of data in a grouped / clustered form.

If the data is loaded via `d3.csv`, it is converted to an array of objects, one per row, with properties names derived from the CSV 'column' headings. The easiest way to manipulate the data into multiple series (one per 'column'), is to use [`d3.data.spread`](/components/data/spread.html) component.

The following example shows how to manipulate some data into the required form, then configures the stacked bar series accordingly:

```js
{{{example-code}}}
```

Which gives the following:

{{>example-fixture}}
