---
layout: component
title: Small Multiples
component: chart/smallMultiples.js
namespace: chart

example-code: |
  var data = [{"date":"20130603","sales":41},{"date":"20130604","sales":70},{"date":"20130605","sales":84},{"date":"20130606","sales":63},{"date":"20130607","sales":63},{"date":"20130608","sales":32},{"date":"20130609","sales":34},{"date":"20130610","sales":46},{"date":"20130611","sales":68},{"date":"20130612","sales":84},{"date":"20130613","sales":61},{"date":"20130614","sales":61},{"date":"20130615","sales":34},{"date":"20130616","sales":32},{"date":"20130617","sales":48},{"date":"20130618","sales":66},{"date":"20130619","sales":86},{"date":"20130620","sales":65},{"date":"20130621","sales":65},{"date":"20130622","sales":37},{"date":"20130623","sales":35},{"date":"20130624","sales":49},{"date":"20130625","sales":65},{"date":"20130626","sales":89},{"date":"20130627","sales":60},{"date":"20130628","sales":63},{"date":"20130629","sales":39},{"date":"20130630","sales":32},{"date":"20130701","sales":54},{"date":"20130702","sales":64},{"date":"20130703","sales":92},{"date":"20130704","sales":66},{"date":"20130705","sales":59},{"date":"20130706","sales":33},{"date":"20130707","sales":34},{"date":"20130708","sales":56},{"date":"20130709","sales":63},{"date":"20130710","sales":95},{"date":"20130711","sales":60},{"date":"20130712","sales":66},{"date":"20130713","sales":34},{"date":"20130714","sales":37},{"date":"20130715","sales":62},{"date":"20130716","sales":58},{"date":"20130717","sales":104},{"date":"20130718","sales":65},{"date":"20130719","sales":65},{"date":"20130720","sales":37},{"date":"20130721","sales":33},{"date":"20130722","sales":70},{"date":"20130723","sales":57},{"date":"20130724","sales":112},{"date":"20130725","sales":64},{"date":"20130726","sales":63},{"date":"20130727","sales":34},{"date":"20130728","sales":34}];

  var parseDate = d3.time.format('%Y%m%d').parse;
  data.forEach(function(d) {
      d.date = parseDate(d.date);
  });

  var lineSeries = fc.series.line()
      .xValue(function(d) { return d.date; })
      .yValue(function(d) { return d.sales; });

  var smallMultiples = fc.chart.smallMultiples(d3.time.scale(), d3.scale.linear())
      .yDomain(fc.util.extent()(data, function() { return 0; }, 'sales'))
      .yNice()
      .xDomain(fc.util.extent()(data, 'date'))
      .xTicks(0)
      .margin({right: 30})
      .columns(7)
      .plotArea(lineSeries);

  var nestedData = d3.nest()
      .key(function(d) { return d3.time.format('%A')(d.date); })
      .entries(data);

  d3.select('#sales-multiples')
      .datum(nestedData)
      .call(smallMultiples);

example-code2: |
    d3.csv('nasa-temp-data.csv', function(error, data) {
        data.forEach(function(d) {
            d.MonthName = d3.time.format('%b')(new Date(d.Year, d.Month - 1, 1));
        });
        var temperatureSeries = d3.nest()
            .key(function(d) { return d.Year; })
            .entries(data);

        var stationLine = fc.series.line()
            .xValue(function(d) { return d.MonthName; })
            .yValue(function(d) { return d.Station; });

        var landOceanLine = fc.series.line()
            .xValue(function(d) { return d.MonthName; })
            .yValue(function(d) { return d['Land+Ocean']; });

        var multi = fc.series.multi()
            .series([landOceanLine, stationLine]);

        var xDomain = data.map(function(d) { return d.MonthName; });
        var yDomain = fc.util.extent()(data, function() { return 0; }, 'Station', 'Land+Ocean');

        var smallMultiples = fc.chart.smallMultiples(
                d3.scale.ordinal(),
                d3.scale.linear())
            .columns(5)
            .yOrient('left')
            .margin({left: 50, bottom: 30})
            .xTickValues(xDomain.filter(function(d, i) { return (i % 3) === 0; }))
            .plotArea(multi)
            .yDomain(yDomain)
            .xDomain(xDomain);

        d3.select('#temperature-multiples')
            .datum(temperatureSeries)
            .call(smallMultiples);
    });
---

A small multiples chart renders a number of series that share the same scales as a grid of tiles. The small multiples component renders an array of data, where each item has a key and an associated array of values (configurable by the `key` and `values` properties respectively). An easy way to prepare the data so that it is in the correct form is to use the `d3.nest`, or d3fc [`spread`](/components/data/spread.html) components.

The following example renders some sales data, grouped by the day of the week. The small multiples component is configured to render a seven column layout:

```js
{{{example-code}}}
```

This results in the following chart:

<style type="text/css">
  #sales-multiples .x-axis { display: none; }
</style>

<div id="sales-multiples"> </div>

<script type="text/javascript">
(function() {
  {{{example-code}}}
}());
</script>

From the above example it can be seen that the small multiples component has a similar API to the [cartesian chart](/components/chart/cartesian.html), re-binding the various x and y axis properties, and exposing `plotArea` and `margin` properties.

The following example demonstrates a small multiples chart with a multi-row grid layout. In this example temperature data is loaded from a CSV file, with `d3.nest` used to manipulate the data into the required format. A multi-series component is used to render a couple of lines on each multiple plot.

```js
{{{example-code2}}}
```

This gives the following small multiples:

<div id="temperature-multiples" style="height: 500px"> </div>

<script type="text/javascript">
(function() {
  {{{example-code2}}}
}());
</script>
