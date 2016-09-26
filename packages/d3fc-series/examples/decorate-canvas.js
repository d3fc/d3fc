var width = 500;
var height = 250;
var margin = 10;

var dataGenerator = fc.randomGeometricBrownianMotion()
  .steps(15);
var data = dataGenerator(1);

var xScale = d3.scaleLinear()
    .domain([0, data.length])
    .range([margin, width - margin * 2]);

var yScale = d3.scaleLinear()
    .domain(fc.extentLinear()(data))
    .range([height, 0]);

var canvas = d3.select('#decorate-canvas').node();
canvas.width = width;
canvas.height = height;
var ctx = canvas.getContext('2d');

var color = d3.scaleOrdinal(d3.schemeCategory10);

var canvasLine = fc.seriesCanvasBar()
    .xScale(xScale)
    .yScale(yScale)
    .context(ctx)
    .crossValue(function(_, i) { return i; })
    .mainValue(function(d) { return d; })
    .decorate(function(context, datum, index) {
        context.fillStyle = color(index);
    });

canvasLine(data);
