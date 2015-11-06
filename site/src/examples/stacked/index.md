---
layout: example
title: Stacked Bar
namespace: examples
tags:
 - playground

example-body: |
    <style>
    #example-chart {
      margin-bottom: 20px;
      width: 100%;
      height: 400px;
    }
    .bar path {
      stroke-width: 0;
    }
    .x-axis .label {
      text-anchor: start;
    }
    .cartesian-chart .background {
      fill: transparent;
      stroke: transparent;
    }
    </style>

    <div id='example-chart'></div>
example-code: |
  d3.csv('data.csv', function(error, data) {
    // manipulate the data into stacked series
    var spread = fc.data.spread()
        .xValueKey('Country');
    var stack = d3.layout.stack()
        .values(function(d) { return d.values; });

    var series = stack(spread(data));

    var color = d3.scale.category20()
      .domain(series.map(function(s) { return s.key; }));

    var yExtent = fc.util.extent()
        .include(0)
        .fields(function(d) { return d.y + d.y0; });

    var legend = d3.legend.color()
      .orient('horizontal')
      .shapeWidth(70)
      .scale(color);

    var stack = fc.series.stacked.bar()
        .orient('horizontal')
        .yValue(function(d) { return d.x; })
        .xValue(function(d) { return d.y0 + d.y; })
        .x0Value(function(d) { return d.y0; })
        .decorate(function(sel, data, index) {
            sel.enter().attr('fill', color(series[index].key));
        });

    var chart = fc.chart.cartesian(
                      d3.scale.linear(),
                      d3.scale.ordinal())
            .xDomain(yExtent(series.map(function(d) { return d.values; })))
            .yDomain(data.map(function(d) { return d.Country; }))
            .xLabel('2013 Energy Production (million tonnes of oil equivalent)')
            .xNice()
            .yOrient('left')
            .yTickSize(0)
            .margin({left: 100, bottom: 40})
            .plotArea(stack)
            .decorate(function(selection) {
                selection.enter()
                    .append('g')
                    .layout({
                        position: 'absolute',
                        right: 10,
                        top: 20,
                        width: 358,
                        height: 36
                    })
                    .call(legend);

                // compute layout from the parent SVG
                selection.enter().layout();
            });

    // render
    d3.select('#example-chart')
        .datum(series)
        .call(chart);
  });
---

{{{example-body}}}

<script>
{{{example-code}}}
</script>

This example demonstrates how a stacked bar chart using energy production data from [eurostat](http://ec.europa.eu/eurostat/statistics-explained/index.php). The chart is constructed from the following components:

 + A [cartesian chart](/components/chart/cartesian.html), with an ordinal y axis and a linear x axis.
 + The data is prepared using the [spread](/components/data/spread.html) component, which creates a two dimensional array of data, followed by a d3 stack layout, which stacks the 'y' values.
 + The data is rendered via a horizontally oriented [stacked bar series](/components/series/stacked.html).
 + The [decorate pattern](/components/introduction/2-decorate-pattern.html) is also used to add a legend (courtesy of the [d3-legend](http://d3-legend.susielu.com) project). In this case, the legend is inserted into the SVG via the enter selection, with [svg flexbox](/components/layout/layout.html) used for positioning.

```js
{{{example-code}}}
```
