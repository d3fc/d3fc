var width = 500;
var height = 250;
var container = d3.select('#point-svg');

var dataGenerator = fc.randomGeometricBrownianMotion()
  .steps(50);
var data = dataGenerator(10);

var xScale = d3.scaleLinear()
    .domain([0, 50])
    .range([0, width]);

var yScale = d3.scaleLinear()
    .domain(fc.extentLinear()(data))
    .range([height, 0]);

var svgPoint = fc.seriesSvgPoint()
    .xScale(xScale)
    .yScale(yScale)
    .crossValue(function(_, i) { return i; })
    .mainValue(function(d) { return d; })
    .type(d3.symbolCircle);

container.append('g')
    .datum(data)
    .call(svgPoint);

var canvas = d3.select('#point-canvas').node();
canvas.width = width;
canvas.height = height;
var ctx = canvas.getContext('2d');

var canvasPoint = fc.seriesCanvasPoint()
    .xScale(xScale)
    .yScale(yScale)
    .context(ctx)
    .crossValue(function(_, i) { return i; })
    .mainValue(function(d) { return d; })
    .type(d3.symbolCircle);
canvasPoint(data);

var webgl = d3.select('#point-webgl').node();
webgl.width = width;
webgl.height = height;
var gl = webgl.getContext('webgl');

var webglPoint = fc.seriesWebglPoint()
    .xScale(xScale)
    .yScale(yScale)
    .context(gl)
    .crossValue(function(_, i) { return i; })
    .mainValue(function(d) { return d; })
    .type(d3.symbolCircle);
webglPoint(data);

d3.select('#point-symbol').on('change', function() {
  var newSymbolString = d3.select(this).property('value');
  var newSymbol = d3[newSymbolString];

  svgPoint.type(newSymbol);
  container.select('g')
    .datum(data)
    .call(svgPoint);

  canvas.width = width;
  canvasPoint.type(newSymbol);
  canvasPoint(data);

  gl.clear(gl.COLOR_BUFFER_BIT);
  webglPoint.type(newSymbol);
  webglPoint(data);
});
