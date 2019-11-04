var width = 500;
var height = 250;
var container = d3.select('#line-svg');

var dataGenerator = fc.randomGeometricBrownianMotion()
  .steps(50);
var data = dataGenerator(10);

var xScale = d3.scaleLinear()
    .domain([0, 50])
    .range([0, width]);

var yScale = d3.scaleLinear()
    .domain(fc.extentLinear()(data))
    .range([height, 0]);

var svgLine = fc.seriesSvgLine()
    .xScale(xScale)
    .yScale(yScale)
    .defined((_, i) => i % 20 !== 0)
    .crossValue(function(_, i) { return i; })
    .mainValue(function(d) { return d; });

container.append('g')
    .datum(data)
    .call(svgLine);

var canvas = d3.select('#line-canvas').node();
canvas.width = width;
canvas.height = height;
var ctx = canvas.getContext('2d');

var canvasLine = fc.seriesCanvasLine()
    .xScale(xScale)
    .yScale(yScale)
    .defined((_, i) => i % 20 !== 0)
    .context(ctx)
    .crossValue(function(_, i) { return i; })
    .mainValue(function(d) { return d; });
canvasLine(data);

var canvasgl = d3.select('#line-webgl').node();
canvasgl.width = width;
canvasgl.height = height;
var gl = canvasgl.getContext('webgl');

var webglLine = fc.seriesWebglLine()
    .xScale(xScale)
    .yScale(yScale)
    .defined((_, i) => i % 20 !== 0)
    .context(gl)
    .crossValue(function(_, i) { return i; })
    .mainValue(function(d) { return d; });

webglLine(data);
