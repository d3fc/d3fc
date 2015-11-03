---
layout: example
title: Scatterplot
namespace: examples

example-code: |
    d3.tsv('data.tsv', function(error, data) {
        // convert string properties to numbers
        data.forEach(function(d) {
            d.sepalLength = Number(d.sepalLength);
            d.sepalWidth = Number(d.sepalWidth);
        });

        var species = d3.set(data.map(function(d) { return d.species; }));
        var color = d3.scale.category10()
            .domain(species.values());

        var legend = d3.legend.color().scale(color);

        var pointSeries = fc.series.point()
            .xValue(function(d) { return d.sepalWidth; })
            .yValue(function(d) { return d.sepalLength; })
            .decorate(function(sel) {
                sel.enter()
                    .attr('fill', function(d) { return color(d.species); });
            });

        var chart = fc.chart.cartesian(
                      d3.scale.linear(),
                      d3.scale.linear())
            .yDomain(fc.util.extent().pad(0.2).fields('sepalLength')(data))
            .xDomain(fc.util.extent().pad(0.2).fields('sepalWidth')(data))
            .xLabel('Sepal Width (cm)')
            .yLabel('Sepal Length (cm)')
            .yOrient('left')
            .margin({left: 50, bottom: 50})
            .plotArea(pointSeries)
            .decorate(function(selection) {
                selection.enter()
                    .append('g')
                    .layout({
                        position: 'absolute',
                        right: 10,
                        top: 10,
                        width: 80,
                        height: 50
                    })
                    .call(legend);

                selection.layout();
            });

        d3.select('#scatter-chart')
            .datum(data)
            .call(chart);
    });
---

<style>
.example-chart {
    position: relative;
    margin-bottom: 20px;
    width: 100%;
}
.point {
    stroke-width: 0;
}
</style>

<script>
{{{example-code}}}
</script>

<div class='example-chart'>
    <div id='scatter-chart' style='height: 400px'></div>
</div>

(based on [bl.ock #3887118](http://bl.ocks.org/mbostock/3887118#index.html) by Mike Bostock)

This example demonstrates how to render a simple scatter plot with data from the [Iris flower dataset](https://en.wikipedia.org/wiki/Iris_flower_data_set). The chart is constructed from the following components:

 + The `d3.tsv` component is used to load a tab-separated data file.
 + A [cartesian chart](../../components/chart/cartesian.html), with linear scales for x and y, is used to render the plot area, axes and labels.
 + A [point series](../../components/series/point.html) is used to render the data, notice the use of the decorate pattern in order to colour each points.
 + A [legend component](../../components/chart/legend.html) renders the legend based on the domain of the d3 color scale.

```
{{{example-code}}}
```
