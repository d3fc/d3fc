---
layout: example
title: Bubble chart
namespace: examples

example-code: |
    d3.json('life-expectancy.json', function(error, data) {
        // convert string properties to numbers
        data.forEach(function(d) {
            d.income = Number(d.income);
            d.population = Number(d.population);
            d.lifeExpectancy = Number(d.lifeExpectancy);
        });

        var regions = d3.set(data.map(function(d) { return d.region; }));
        var color = d3.scale.category10()
            .domain(regions.values());

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
            .legend(d3.legend.color().scale(color))
            .legendLayout({position: 'absolute', right: 170, bottom: 110})
            .margin({left: 40, bottom: 40, top: 30})
            .plotArea(pointSeries);

        d3.select('#bubble-chart')
            .datum(data)
            .call(chart);

    });
---

<style>
g.point path {
    stroke-width: 0;
}
.title text {
    font-size: 15pt;
}
.example-chart {
    position: relative;
    margin-bottom: 20px;
    width: 100%;
}
</style>

<script>
{{{example-code}}}
</script>

<div id='bubble-chart' style='height: 400px'></div>

This example demonstrates how to render a bubble chart with data that shows the relationship between life expectancy and wealth, obtained via  [Gapminder](http://www.gapminder.org/world/#$majorMode=chart$is;shi=t;ly=2003;lb=f;il=t;fs=11;al=30;stl=t;st=t;nsl=t;se=t$wst;tts=C$ts;sp=5.59290322580644;ti=2013$zpv;v=0$inc_x;mmid=XCOORDS;iid=phAwcNAVuyj1jiMAkmq1iMg;by=ind$inc_y;mmid=YCOORDS;iid=phAwcNAVuyj2tPLxKvvnNPA;by=ind$inc_s;uniValue=8.21;iid=phAwcNAVuyj0XOoBL_n5tAQ;by=ind$inc_c;uniValue=255;gid=CATID0;by=grp$map_x;scale=log;dataMin=194;dataMax=96846$map_y;scale=lin;dataMin=23;dataMax=86$map_s;sma=49;smi=2.65$cd;bd=0$inds=;modified=60). The chart is constructed from the following components:

 + The `d3.json` component is used to load the data from a JSON file.
 + A [cartesian chart](../../components/chart/cartesian.html), with a logarithmic x scale and linear y scale, is used to render the plot area, axes and labels.
 + A [point series](../../components/series/point.html) is used to render the data, with the `size` of each point defined via another linear scale.
 + A [legend component](../../components/chart/legend.html) renders the legend based on the domain of the d3 color scale.

```
{{{example-code}}}
```
