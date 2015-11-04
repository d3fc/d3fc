---
layout: example
title: Stacked Bar
namespace: examples

example-code: |
  d3.csv('energy-production-2013.csv', function(error, data) {
    // manipulate the data into stacked series
    var spread = fc.data.spread()
        .xValueKey('Country');
    var stack = d3.layout.stack()
        .values(function(d) { return d.values; });

    var series = stack(spread(data));

    var color = d3.scale.category20()
      .domain(series.map(function(s) { return s.key; }))

    var yExtent = fc.util.extent()
        .include(0)
        .fields(function(d) { return d.y + d.y0; });

    var legend = d3.legend.color()
      .scale(color);

    // create the stacked bar series (this could also be line or area)
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
            .xLabel('Sepal Width (cm)')
            .xNice()
            .yOrient('left')
            .margin({left: 50, bottom: 50})
            .plotArea(stack)
            .decorate(function(selection) {
                selection.enter()
                    .append('g')
                    .layout({
                        position: 'absolute',
                        right: 10,
                        top: 50,
                        width: 165,
                        height: 100
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

<style>
#example-chart {
    margin-bottom: 20px;
    width: 100%;
    height: 400px;
}
.bar path {
  stroke-width: 0;
}
</style>

<div id='example-chart'></div>

<script>
{{{example-code}}}
</script>

http://ec.europa.eu/eurostat/statistics-explained/index.php/File:Energy_production,_2003_and_2013_(million_tonnes_of_oil_equivalent)_YB15.png

```js
{{{example-code}}}
```
