---
layout: example
title: Bubble chart
namespace: examples
tags:
 - playground

example-body: |
    <style>
    .point path {
        stroke-width: 0;
    }
    .title text {
        font-size: 15pt;
    }
    #bubble-chart {
        margin-bottom: 20px;
        width: 100%;
        height: 400px;
    }
    </style>

    <div id='bubble-chart'></div>
example-code: |
    d3.json('data.json', function(error, data) {
        // convert string properties to numbers
        data.forEach(function(d) {
            d.income = Number(d.income);
            d.population = Number(d.population);
            d.lifeExpectancy = Number(d.lifeExpectancy);
        });

        var regions = d3.set(data.map(function(d) { return d.region; }));
        var color = d3.scale.category10()
            .domain(regions.values());

        var legend = d3.legend.color()
            .scale(color);

        var size = d3.scale.linear()
            .range([20, 800])
            .domain(fc.util.extent().fields('population')(data));

        var pointSeries = fc.series.point()
            .xValue(function(d) { return d.income; })
            .yValue(function(d) { return d.lifeExpectancy; })
            .size(function(d) { return size(d.population); })
            .decorate(function(sel) {
                sel.enter()
                    .attr('fill', function(d) { return color(d.region); });
            });

        var chart = fc.chart.cartesian(
                      d3.scale.log(),
                      d3.scale.linear())
            .xDomain(fc.util.extent().fields('income')(data))
            .yDomain(fc.util.extent().pad(.2).fields('lifeExpectancy')(data))
            .xLabel('Income (dollars)')
            .yLabel('Life expectancy (years)')
            .xTicks(2, d3.format(",d"))
            .chartLabel('The Wealth & Health of Nations')
            .yOrient('left')
            .margin({left: 40, bottom: 40, top: 30})
            .plotArea(pointSeries)
            .decorate(function(selection) {
                selection.enter()
                    .append('g')
                    .layout({
                        position: 'absolute',
                        right: 10,
                        bottom: 50,
                        width: 165,
                        height: 100
                    })
                    .call(legend);

                // compute layout from the parent SVG
                selection.enter().layout();
            });

        d3.select('#bubble-chart')
            .datum(data)
            .call(chart);

    });
---

{{{example-body}}}

<script>
{{{example-code}}}
</script>

This example demonstrates how to render a bubble chart with data that shows the relationship between life expectancy and wealth, obtained via  [Gapminder](http://www.gapminder.org/world/#$majorMode=chart$is;shi=t;ly=2003;lb=f;il=t;fs=11;al=30;stl=t;st=t;nsl=t;se=t$wst;tts=C$ts;sp=5.59290322580644;ti=2013$zpv;v=0$inc_x;mmid=XCOORDS;iid=phAwcNAVuyj1jiMAkmq1iMg;by=ind$inc_y;mmid=YCOORDS;iid=phAwcNAVuyj2tPLxKvvnNPA;by=ind$inc_s;uniValue=8.21;iid=phAwcNAVuyj0XOoBL_n5tAQ;by=ind$inc_c;uniValue=255;gid=CATID0;by=grp$map_x;scale=log;dataMin=194;dataMax=96846$map_y;scale=lin;dataMin=23;dataMax=86$map_s;sma=49;smi=2.65$cd;bd=0$inds=;modified=60). The chart is constructed from the following components:

 + The `d3.json` component is used to load the data from a JSON file.
 + A [cartesian chart](/components/chart/cartesian.html), with a logarithmic x scale and linear y scale, is used to render the plot area, axes and labels.
 + A [point series](/components/series/point.html) is used to render the data, with the `size` of each point defined via another linear scale.
 + The [decorate pattern](/components/introduction/2-decorate-pattern.html) is used to add a legend (courtesy of the [d3-legend](http://d3-legend.susielu.com) project). In this case, the legend is inserted into the SVG via the enter selection, with [svg flexbox](/components/layout/layout.html) used for positioning.


```js
{{{example-code}}}
```
