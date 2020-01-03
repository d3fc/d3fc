var width = 500;
var height = 250;
var container = d3.select('#bar-svg');

var dataGenerator = fc.randomGeometricBrownianMotion()
  .steps(50);
var data = dataGenerator(1);

var xScale = d3.scaleLinear()
    .domain([0, data.length])
    .range([0, width]);

var yScale = d3.scaleLinear()
    .domain(fc.extentLinear()(data))
    .range([height, 0]);

var svgBar = fc.seriesSvgBar()
    .xScale(xScale)
    .yScale(yScale)
    .crossValue(function(_, i) { return i; })
    .mainValue(function(d) { return d; });

container.append('g')
    .datum(data)
    .call(svgBar);

var canvas = d3.select('#bar-canvas').node();
canvas.width = width;
canvas.height = height;
var ctx = canvas.getContext('2d');

var canvasBar = fc.seriesCanvasBar()
    .xScale(xScale)
    .yScale(yScale)
    .context(ctx)
    .crossValue(function(_, i) { return i; })
    .mainValue(function(d) { return d; });
canvasBar(data);

var webgl = d3.select('#bar-webgl').node();
webgl.width = width;
webgl.height = height;
var gl = webgl.getContext('webgl');

var webglBar = fc.seriesWebglBar()
    .xScale(xScale)
    .yScale(yScale)
    .context(gl)
    .crossValue(function(_, i) { return i; })
    .mainValue(function(d) { return d; })
    .bandwidth(0.5);
webglBar(data);
