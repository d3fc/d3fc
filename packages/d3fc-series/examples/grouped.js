var width = 500;
var height = 250;

var data = [{
    'State': 'AL',
    'Under 5 Years': '310',
    '5 to 13 Years': '552',
    '14 to 17 Years': '259',
    '18 to 24 Years': '450',
    '25 to 44 Years': '1215',
    '45 to 64 Years': '641'
}, {
    'State': 'AK',
    'Under 5 Years': '52',
    '5 to 13 Years': '85',
    '14 to 17 Years': '42',
    '18 to 24 Years': '74',
    '25 to 44 Years': '183',
    '45 to 64 Years': '50'
}, {
    'State': 'AZ',
    'Under 5 Years': '515',
    '5 to 13 Years': '828',
    '14 to 17 Years': '362',
    '18 to 24 Years': '601',
    '25 to 44 Years': '1804',
    '45 to 64 Years': '1523'
}, {
    'State': 'AR',
    'Under 5 Years': '202',
    '5 to 13 Years': '343',
    '14 to 17 Years': '157',
    '18 to 24 Years': '264',
    '25 to 44 Years': '754',
    '45 to 64 Years': '727'
}];

// manipulate the data into stacked series
var group = fc.group()
    .key('State');

var series = group(data);

// use a band scale, which provides the bandwidth value to the grouped
// series via fc.autoBandwidth
var x = d3.scaleBand()
    .domain(data.map(function(d) { return d.State; }))
    .paddingInner(0.2)
    .paddingOuter(0.1)
    .rangeRound([0, width]);

var yExtent = fc.extentLinear()
    .accessors([
        function(a) {
            return a.map(function(d) { return d[1]; });
        }
    ])
    .include([0]);

var y = d3.scaleLinear()
    .domain(yExtent(series))
    .range([height, 0]);

var groupedSeries = fc.seriesSvgBar();

var color = d3.scaleOrdinal(d3.schemeCategory10);

// create the grouped series
var groupedBar = fc.seriesSvgGrouped(groupedSeries)
    .xScale(x)
    .yScale(y)
    .align('left')
    .crossValue(function(d) { return d[0]; })
    .mainValue(function(d) { return d[1]; })
    .decorate(function(sel, data, index) {
        sel.enter()
            .select('path')
            .attr('fill', function() { return color(index); });
    });

d3.select('#grouped-svg-autobandwidth-bandscale')
    .attr('width', width)
    .attr('height', height)
    .datum(series)
    .call(fc.autoBandwidth(groupedBar));

// now render the same series against a linear scale. In this case the auto-bandwidth
// wrapper will compute the bandwidth based on the underlying data
var x2 = d3.scaleLinear()
    .domain([-0.5, data.length - 0.5])
    .range([0, width]);

groupedBar.xScale(x2)
  .crossValue(function(d, i) { return i; })
  // centre align the bars around the points on the scale
  .align('center');

d3.select('#grouped-svg-autobandwidth-linearscale')
    .attr('width', width)
    .attr('height', height)
    .datum(series)
    .call(fc.autoBandwidth(groupedBar));

// now render the same series against a point scale.
var x3 = d3.scalePoint()
    .domain(data.map(function(d) { return d.State; }))
    .padding(0.5)
    .range([0, width]);

groupedBar.xScale(x3)
  .crossValue(function(d) { return d[0]; })
  // centre align the bars around the points on the scale
  .align('center')
  // because point scales have a zero bandwidth, in this context we
  // provide an explicit bandwidth and don't wrap the series in fc.autoBandwidth.
  // this example also shows how bandwidth can vary on a point-to-point basis
  .bandwidth((_, i) => 50 + i % 2 * 50);

d3.select('#grouped-svg-variable-bandwidth')
    .attr('width', width)
    .attr('height', height)
    .datum(series)
    .call(groupedBar);

// Show a horizontal grouped bar
var yHorizontal = d3.scaleBand()
    .domain(data.map(function(d) { return d.State; }))
    .paddingInner(0.2)
    .paddingOuter(0.1)
    .rangeRound([0, height]);

var xHorizontalExtent = fc.extentLinear()
    .accessors([
        function(a) {
            return a.map(function(d) { return d[1]; });
        }
    ])
    .include([0]);

var xHorizontal = d3.scaleLinear()
    .domain(xHorizontalExtent(series))
    .range([0, width]);

var groupedHorizontal = fc.seriesSvgGrouped(groupedSeries)
    .orient('horizontal')
    .xScale(xHorizontal)
    .yScale(yHorizontal)
    .align('left')
    .crossValue(function(d) { return d[0]; })
    .mainValue(function(d) { return d[1]; })
    .decorate(function(sel, data, index) {
        sel.enter()
            .select('path')
            .attr('fill', function() { return color(index); });
    });

d3.select('#grouped-svg-horizontal')
    .attr('width', width)
    .attr('height', height)
    .datum(series)
    .call(fc.autoBandwidth(groupedHorizontal));

var canvas = d3.select('#grouped-canvas').node();
canvas.width = width;
canvas.height = height;
var ctx = canvas.getContext('2d');

var groupedCanvasSeries = fc.seriesCanvasBar();

// create the grouped series
var groupedCanvasBar = fc.autoBandwidth(fc.seriesCanvasGrouped(groupedCanvasSeries))
    .xScale(x)
    .yScale(y)
    .align('left')
    .crossValue(function(d) { return d[0]; })
    .mainValue(function(d) { return d[1]; })
    .context(ctx)
    .decorate(function(ctx, data, index) {
        ctx.fillStyle = color(index);
    });

groupedCanvasBar(series);

var canvasHorizontal = d3.select('#grouped-canvas-horizontal').node();
canvasHorizontal.width = width;
canvasHorizontal.height = height;

// create the horizontal grouped series
var groupedCanvasBarHorizontal = fc.autoBandwidth(fc.seriesCanvasGrouped(fc.seriesCanvasBar()))
    .orient('horizontal')
    .xScale(xHorizontal)
    .yScale(yHorizontal)
    .align('left')
    .crossValue(function(d) { return d[0]; })
    .mainValue(function(d) { return d[1]; })
    .context(canvasHorizontal.getContext('2d'))
    .decorate(function(ctx, data, index) {
        ctx.fillStyle = color(index);
    });

groupedCanvasBarHorizontal(series);
