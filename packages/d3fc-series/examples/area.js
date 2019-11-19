var width = 500;
var height = 250;
var container = d3.select('#area-svg');

var dataGenerator = fc.randomGeometricBrownianMotion()
  .steps(10);
var data = dataGenerator(10);

var xScale = d3.scaleLinear()
    .domain([0, data.length])
    .range([0, width]);

var yScale = d3.scaleLinear()
    .domain(fc.extentLinear()(data))
    .range([height, 0]);

var svgLine = fc.seriesSvgArea()
    .xScale(xScale)
    .yScale(yScale)
    // .defined((_, i) => i % 20 !== 0)
    .crossValue(function(_, i) { return i; })
    .mainValue(function(d) { return d; });

container.append('g')
    .datum(data)
    .call(svgLine);

var canvas = d3.select('#area-canvas').node();
canvas.width = width;
canvas.height = height;
var ctx = canvas.getContext('2d');

var canvasLine = fc.seriesCanvasArea()
    .xScale(xScale)
    .yScale(yScale)
    // .defined((_, i) => i % 20 !== 0)
    .context(ctx)
    .crossValue(function(_, i) { return i; })
    .mainValue(function(d) { return d; })
    .baseValue(11);
canvasLine(data);

var webgl = d3.select('#area-webgl').node();
webgl.width = width;
webgl.height = height;
var gl = webgl.getContext('webgl');

gl.enable(gl.BLEND);
gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

var webglArea = fc.seriesWebglArea()
  .xScale(xScale)
  .yScale(yScale)
  // .defined((_, i) => i % 20 !== 0)
  .context(gl)
  .crossValue((_, i) => i)
  .mainValue((d) => d)
  .baseValue(11);
webglArea(data);
