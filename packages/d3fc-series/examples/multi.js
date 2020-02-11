var width = 500;
var height = 250;
var container = d3.select('#multi-svg');

var dataGenerator = fc.randomGeometricBrownianMotion()
  .steps(10);
var data = dataGenerator(1);

var xScale = d3.scaleLinear()
    .domain([0, data.length])
    .range([0, width]);

var yScale = d3.scaleLinear()
    .domain(fc.extentLinear().pad([0.5, 0.5])(data))
    .range([height, 0]);

var svgBar = fc.seriesSvgBar()
    .crossValue(function(_, i) { return i; })
    .mainValue(function(d) { return d; });

var svgLine = fc.seriesSvgLine()
    .crossValue(function(_, i) { return i; })
    .mainValue(function(d) { return d; });

var svgMulti = fc.seriesSvgMulti()
    .xScale(xScale)
    .yScale(yScale)
    .series([fc.autoBandwidth(svgBar), svgLine]);

container.append('g')
    .datum(data)
    .call(svgMulti);

var canvas = d3.select('#multi-canvas').node();
canvas.width = width;
canvas.height = height;
var ctx = canvas.getContext('2d');

var canvasBar = fc.seriesCanvasBar()
    .crossValue(function(_, i) { return i; })
    .mainValue(function(d) { return d; });

var canvasLine = fc.seriesCanvasLine()
    .crossValue(function(_, i) { return i; })
    .mainValue(function(d) { return d; });

var canvasMulti = fc.seriesCanvasMulti()
    .xScale(xScale)
    .yScale(yScale)
    .context(ctx)
    .series([fc.autoBandwidth(canvasBar), canvasLine]);

canvasMulti(data);

var webgl = d3.select('#multi-webgl').node();
webgl.width = width;
webgl.height = height;
var gl = webgl.getContext('webgl');

var webglBar = fc.seriesWebglBar()
    .crossValue(function(_, i) { return i; })
    .mainValue(function(d) { return d; })
    .decorate((program) => {
        fc.webglFillColor([0.6, 0.6, 0.6, 1])(program);
    });

var webglLine = fc.seriesWebglLine()
    .crossValue(function(_, i) { return i; })
    .mainValue(function(d) { return d; });

var webglMulti = fc.seriesWebglMulti()
    .xScale(xScale)
    .yScale(yScale)
    .context(gl)
    .series([fc.autoBandwidth(webglBar), webglLine]);

webglMulti(data);
