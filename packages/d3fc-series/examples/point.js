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
    .mainValue(function(d) { return d; });

container.append('g')
    .datum(data)
    .call(svgPoint);

var canvas = d3.select('#point-canvas').node();
canvas.width = width;
canvas.height = height;
var ctx = canvas.getContext('2d');

var canvasLine = fc.seriesCanvasPoint()
    .xScale(xScale)
    .yScale(yScale)
    .context(ctx)
    .crossValue(function(_, i) { return i; })
    .mainValue(function(d) { return d; });
canvasLine(data);
