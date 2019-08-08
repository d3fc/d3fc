var width = 500;
var height = 250;
var container = d3.select('#stacked-svg');
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
var stack = d3.stack()
    .keys(Object.keys(data[0]).filter(function(k) { return k !== 'State'; }));

var series = stack(data);

var yExtent = fc.extentLinear()
    .accessors([
        function(a) {
            return a.map(function(d) { return d[1]; });
        }
    ])
    .include([0]);

// create scales
var x = d3.scalePoint()
    .domain(data.map(function(d) { return d.State; }))
    .range([0, width])
    .padding(0.5);

var yExt = yExtent(series);

var color = d3.scaleOrdinal(d3.schemeCategory10);

var y = d3.scaleLinear()
    .domain(yExt)
    .range([height, 0]);

var barSeries = fc.seriesSvgBar()
    .xScale(x)
    .yScale(y)
    .crossValue(function(d) { return d.data.State; })
    .mainValue(function(d) { return d[1]; })
    .baseValue(function(d) { return d[0]; })
    .decorate(function(group, data, index) {
        group.selectAll('path')
            .attr('fill', color(index));
    });

var join = fc.dataJoin('g', 'series');

join(container, series)
    .call(barSeries);

var canvas = d3.select('#stacked-canvas').node();
canvas.width = width;
canvas.height = height;
var ctx = canvas.getContext('2d');

var canvasBarSeries = fc.seriesCanvasBar()
    .xScale(x)
    .yScale(y)
    .crossValue(function(d) { return d.data.State; })
    .mainValue(function(d) { return d[1]; })
    .baseValue(function(d) { return d[0]; })
    .context(ctx);

series.forEach(function(s, i) {
    canvasBarSeries
        .decorate(function(ctx) {
            ctx.fillStyle = color(i);
        })(s);
});

var webgl = d3.select('#stacked-webgl').node();
webgl.width = width;
webgl.height = height;
var gl = webgl.getContext('webgl');

var webglBarSeries = fc.seriesWebglBar()
    .xScale(x)
    .yScale(y)
    .crossValue(function(d) { return d.data.State; })
    .mainValue(function(d) { return d[1]; })
    .baseValue(function(d) { return d[0]; })
    .context(gl);
series.forEach(function(s, i) {
    webglBarSeries
        .decorate((program) => {
            fc.barFill().color(color(i))(program);
        })(s);
});
