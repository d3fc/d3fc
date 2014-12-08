---
layout: default
---

##Getting Started

This guide provides step-by-step instructions which will lead you through the process of building a simple financial chart as shown below:

<div id="final-chart" style="width:400px; height:200px"></div>

<script>
(function(){
// Create the chartLayout (width and height not set)
var chartLayout = fc.utilities.chartLayout();

// create some data
var startDate = new Date(2014, 1, 1);
var endDate = new Date(2014, 3, 1);
var dataSeries = fc.utilities.dataGenerator()
  .fromDate(startDate)
  .toDate(endDate)
  .generate();

// Setup the chart
var setupArea = d3.select('#final-chart')
    .call(chartLayout);

// create scales
var x = fc.scale.finance() // financial scale (actually it is a date / time)
  .domain([startDate, endDate])
  .range([chartLayout.innerWidth(), 0]);

var yLow = d3.min(dataSeries, function (d) { return d.low; });
var yHigh = d3.max(dataSeries, function (d) { return d.high; });
var y = d3.scale.linear()
  .domain([yLow, yHigh])
  .range([chartLayout.innerHeight(), 0]);

// add axes
var bottomAxis = d3.svg.axis()
    .scale(x)
    .orient('bottom')
    .ticks(5);
chartLayout.getAxisContainer(setupArea, 'bottom').call(bottomAxis);

var leftAxis = d3.svg.axis()
    .scale(y)
    .orient('left')
    .ticks(5);
chartLayout.getAxisContainer(setupArea, 'left').call(leftAxis);

// Create the OHLC series
var ohlc = fc.series.ohlc()
  .xScale(x)
  .yScale(y);

// Add the primary OHLC series
chartLayout.getPlotArea(setupArea).append('g')
  .attr('class', 'series')
  .datum(dataSeries)
  .call(ohlc);
}());
</script>

##A Brief Background

*If you just want to get your hands dirty, and build a chart, you can skip this section!*

We created the **D3FC** project for a quite specific reason, we've all been through the process of building complex web-based charts on a number of occasions. There are a numerous commercial and open source charting products, however all of them have limitations. They are all essentially black-boxes, in that you are constrained by the APIs they present. If the chart wasn't designed to perform your specific task, or adopt your style, you're stuck!

At the opposite end of the spectrum is <a href="http://d3js.org/">D3</a>, a toolbox for constructing visualisation based on (and driven by) data. It's the opposite of a black-box charting product, in that it gives you complete control over how you construct your chart (or any other visualisation). However, power comes at a cost, with D3 you have to put a lot more effort in before you reap the reward.

This is where **D3FC** comes in! This project provides a set of building blocks that sit on top of and alongside the basic D3 constructs. This allow you to assemble charts quickly and easily, without taking away the underlying power of D3. These components can be assembled, configured and styled with CSS to produce a whole range of different charts.

Because you will be building charts with a combination of D3 and **D3FC**, you will need to know how D3 works, although you don't need to be an expert. It is well worth reading the [Let's Make a Bar Chart](http://bost.ocks.org/mike/bar/) series to familiarise yourself with the basic concepts.

##A Minimal Page

Download the latest [distribution CSS and JavaScript](https://github.com/ScottLogic/d3-financial-components/tree/master/dist) files, and construct a minimal HTML document:

    <!DOCTYPE html>
    <title>D3FC Test</title>
    <link rel="stylesheet" href="d3-financial-components.css"/>
    <script src="http://d3js.org/d3.v3.min.js" charset="utf-8"></script>
    <script src="d3-financial-components.js"></script>

    <div id="chart" style="width:300px; height: 200px"></div>

(Yes that [is a valid HTML document](http://stackoverflow.com/questions/5641997/is-it-necessary-to-write-head-body-and-html-tags))

The `div` is going to contain your chart. Typically the width and height of this element would be determined by your page layout, but for the purposes of this demonstration they are hard-coded.

##Creating The Layout

The first step is to construct an SVG where your chart will be rendered. If you've previously constructed a chart using D3 you'll probably be familiar with the [margin convention](http://bl.ocks.org/mbostock/3019563), this is a 'standard' way of constructing a chart, although it is a bit painful to implement!

The D3FC `chartLayout` component takes care of constructing a suitable containers for the various components of a chart. Add the following to the bottom of your page:

    <script>
    var chartLayout = fc.utilities.chartLayout();

    var chart = d3.select('#chart')
        .call(chartLayout);
    </script>

The `chartLayout` takes a [D3 selection](https://github.com/mbostock/d3/wiki/Selections), which in this case is the `div` you added earlier and constructs an SVG and a number of other elements:

<div id="step-layout" style="width:400px; height:200px"></div>

It doesn't look that exciting yet, although you might want to take a look at the DOM to see what's in there.

<script>
(function(){
var chartLayout = fc.utilities.chartLayout();

// Setup the chart
var chart = d3.select('#step-layout')
    .call(chartLayout);
}());
</script>

##Generating Some Data

Before you create a chart you're going to need some data. You'll no doubt have your own source of data, but for testing purposes D3FC has a dummy datasource. 

Update your code to add the following:

    // create some data
    var startDate = new Date(2014, 1, 1),
        endDate = new Date(2014, 3, 1);

    var data = fc.utilities.dataGenerator()
      .fromDate(startDate)
      .toDate(endDate)
      .generate();

    console.log(JSON.stringify(data))

The `dataGenerator` component generates dummy financial data for a given date range. You should see something like the following in the developer console:

    [{"date":"2014-02-03T00:00:00.000Z",
      "open":100,
      "high":100.6395184284066,
      "low":100,
      "close":100.38865818452763,
      "volume":98961},
     {"date":"2014-02-04T00:00:00.000Z",
      "open":100.17928127475005,
      "high":100.88508097440548,
      "low":99.54421767086801,
      "close":100.84739820776808,
      "volume":80335},
      ... ]

##Adding Scales and Axes

Scales map between your data domain and a visible output range, they are used by virtually every renderable component. 

Add the following scales to your code:

    var xScale = fc.scale.finance() 
      .domain([startDate, endDate])
      .range([chartLayout.innerWidth(), 0]);

    var yLow = d3.min(data, function (d) { return d.low; });
    var yHigh = d3.max(data, function (d) { return d.high; });
    var yScale = d3.scale.linear()
      .domain([yLow, yHigh])
      .range([chartLayout.innerHeight(), 0]);

The `fc.scale.finance` provides logic for skipping time periods (for example weekends - if required) and also ensures that the dates are correctly rendered. Because the input data is randomly generated, the extents of the 'y' scale are computed via the `d3.max` and `d3.min` functions.

In order to view the chart scale, the next step is to add a pair of axes:

    var bottomAxis = d3.svg.axis()
        .scale(x)
        .orient('bottom')
        .ticks(5);
    chartLayout.getAxisContainer(chart, 'bottom').call(bottomAxis);

    var leftAxis = d3.svg.axis()
        .scale(y)
        .orient('left')
        .ticks(5);
    chartLayout.getAxisContainer(chart, 'left').call(leftAxis);

The `d3.svg.axis` component takes a scale and renders this within your SVG element. The `chartLayout` component provides containers for the four possible axis locations, `top`, `bottom`, `left` and `right`.

With the scales and axes added, the chart looks like the following:

<div id="step-scale" style="width:400px; height:200px"></div>

<script>
(function(){
var chartLayout = fc.utilities.chartLayout();

// Setup the chart
var chart = d3.select('#step-scale')
    .call(chartLayout);

// create some data
var startDate = new Date(2014, 1, 1),
    endDate = new Date(2014, 3, 1);

var data = fc.utilities.dataGenerator()
  .fromDate(startDate)
  .toDate(endDate)
  .generate();

console.log(JSON.stringify(data))

// create scales
var x = fc.scale.finance() // financial scale (actually it is a date / time)
  .domain([startDate, endDate])
  .range([chartLayout.innerWidth(), 0]);

var yLow = d3.min(data, function (d) { return d.low; });
var yHigh = d3.max(data, function (d) { return d.high; });
var y = d3.scale.linear()
  .domain([yLow, yHigh])
  .range([chartLayout.innerHeight(), 0]);

// add axes
var bottomAxis = d3.svg.axis()
    .scale(x)
    .orient('bottom')
    .ticks(5);
chartLayout.getAxisContainer(chart, 'bottom').call(bottomAxis);

var leftAxis = d3.svg.axis()
    .scale(y)
    .orient('left')
    .ticks(5);
chartLayout.getAxisContainer(chart, 'left').call(leftAxis);
}());
</script>

##Adding a series

The final step is to add a series that renders the chart data. With D3 this would typically require the construction of suitable SVG elements, with their properties being set based on a combination of the input data and the scales.

With D3FC, it is simply a matter of constructing the series component, then adding it to the chart as follows:

    // Create the OHLC series
    var ohlc = fc.series.ohlc()
      .xScale(x)
      .yScale(y);

    // Add to the dplot area
    chartLayout.getPlotArea(chart).append('g')
      .datum(data)
      .call(ohlc);

This gives us the final chart:

<div id="final-chart2" style="width:400px; height:200px"></div>

<script>
(function(){
// Create the chartLayout (width and height not set)
var chartLayout = fc.utilities.chartLayout();

// create some data
var startDate = new Date(2014, 1, 1);
var endDate = new Date(2014, 3, 1);
var dataSeries = fc.utilities.dataGenerator()
  .fromDate(startDate)
  .toDate(endDate)
  .generate();

// Setup the chart
var setupArea = d3.select('#final-chart2')
    .call(chartLayout);

// create scales
var x = fc.scale.finance() // financial scale (actually it is a date / time)
  .domain([startDate, endDate])
  .range([chartLayout.innerWidth(), 0]);

var yLow = d3.min(dataSeries, function (d) { return d.low; });
var yHigh = d3.max(dataSeries, function (d) { return d.high; });
var y = d3.scale.linear()
  .domain([yLow, yHigh])
  .range([chartLayout.innerHeight(), 0]);

// add axes
var bottomAxis = d3.svg.axis()
    .scale(x)
    .orient('bottom')
    .ticks(5);
chartLayout.getAxisContainer(setupArea, 'bottom').call(bottomAxis);

var leftAxis = d3.svg.axis()
    .scale(y)
    .orient('left')
    .ticks(5);
chartLayout.getAxisContainer(setupArea, 'left').call(leftAxis);

// Create the OHLC series
var ohlc = fc.series.ohlc()
  .xScale(x)
  .yScale(y);

// Add the primary OHLC series
chartLayout.getPlotArea(setupArea).append('g')
  .attr('class', 'series')
  .datum(dataSeries)
  .call(ohlc);
}());
</script>

##What next?

You've seen how easy it is to build a chart using D3 and D3FC, why not take a look out the list of <a href="components.html">components</a> and try adding some more features to the chart?