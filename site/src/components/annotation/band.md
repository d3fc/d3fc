---
layout: component
title: Band
component: annotation/band.js
tags:
 - playground
namespace: annotation

example-code: |
  var verticalBand = fc.annotation.band()
      .xScale(xScale)
      .yScale(yScale)
      .x0(function(d) { return d.start; })
      .x1(function(d) { return d.end; });

  var xBands = [
    { start: data[2].date, end: data[15].date },
    { start: data[25].date, end: data[30].date },
    { start: data[35].date, end: data[45].date }
  ];

  container.append('g')
      .datum(xBands)
      .call(verticalBand);

  var horizontalBand = fc.annotation.band()
      .xScale(xScale)
      .yScale(yScale)
      .y0(function(d) { return d[0]; })
      .y1(function(d) { return d[1]; });

  var ticks = yScale.ticks();
  var yBands = d3.pairs(ticks)
        .filter(function(d, i) { return i % 2 === 0; });

  container.append('g')
      .datum(yBands)
      .call(horizontalBand);
---

This band annotation component renders horizontal or vertical bands. The orientation of the band is determined by the accessors that are supplied, i.e. if you supply an `x0` and an `x1` value the component renders vertical bands, whereas by supplying `y0` and `y1` values you can render horizontal bands.

The following example demonstrates both vertical and horizontal bands, where each are based on an array of data. For the horizontal bands a few 'random' values from the x scale are used, whereas for the vertical, the y scale ticks are used as a source of data for the bands:

```js
{{{example-code}}}
```

Which gives the following:

{{>example-fixture}}
