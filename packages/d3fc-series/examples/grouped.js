var width = 500;
var height = 250;
var container = d3.select('#grouped-svg');
container.attr({'width': width, 'height': height});

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

// create scales
var x = d3.scalePoint()
    .domain(data.map(function(d) { return d.State; }))
    .range([0, width])
    .padding(0.5);

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
    .crossValue(function(d) { return d[0]; })
    .mainValue(function(d) { return d[1]; })
    .decorate(function(sel, data, index) {
        sel.enter()
            .select('path')
            .attr('fill', function() { return color(index); });
    });

// render
container.append('g')
    .datum(series)
    .call(groupedBar);

var canvas = d3.select('#grouped-canvas').node();
canvas.width = width;
canvas.height = height;
var ctx = canvas.getContext('2d');

var groupedCanvasSeries = fc.seriesCanvasBar();

// create the grouped series
var groupedCanvasBar = fc.seriesCanvasGrouped(groupedCanvasSeries)
    .xScale(x)
    .yScale(y)
    .crossValue(function(d) { return d[0]; })
    .mainValue(function(d) { return d[1]; })
    .context(ctx)
    .decorate(function(ctx, data, index) {
        ctx.fillStyle = color(index);
    });

groupedCanvasBar(series);
