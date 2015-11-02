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

        var color = d3.scale.category10();

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
            .plotArea(pointSeries);

        d3.select('#scatter-chart')
            .datum(data)
            .call(chart);

        function swatch(i) {
            return '<span class="swatch" style="background-color: ' +
                color(i) + '">&nbsp;</span>';
        }

        var legend = fc.chart.legend()
            .items(color.domain().map(function(d, i) {
                return [swatch(d), d];
            }));

        d3.select('#legend')
            .data([0])
            .call(legend);
    });
---

<style>
.example-chart {
    position: relative;
    margin-bottom: 20px;
    width: 100%;
}
#legend {
    position: absolute;
    top: 10px;
    right: 10px;
}
#legend td, #legend th {
    padding: 1px 2px;
}
.swatch {
    width: 10px;
    display: block;
}
</style>

<script>
{{{example-code}}}
</script>

<div class='example-chart'>
    <div id='legend'></div>
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
