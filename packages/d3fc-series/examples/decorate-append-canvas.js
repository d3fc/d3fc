var width = 500;
var height = 250;
var margin = 15;

var dataGenerator = fc.randomGeometricBrownianMotion()
  .steps(10);
var data = dataGenerator(1);

var xScale = d3.scaleLinear()
    .domain([0, data.length])
    .range([margin, width - margin * 2]);

var yScale = d3.scaleLinear()
    .domain(fc.extentLinear().pad([0.1, 0.1])(data))
    .range([height, 0]);

var canvas = d3.select('#decorate-canvas').node();
canvas.width = width;
canvas.height = height;
var ctx = canvas.getContext('2d');

var canvasLine = fc.seriesCanvasPoint()
    .xScale(xScale)
    .yScale(yScale)
    .context(ctx)
    .crossValue(function(_, i) { return i; })
    .mainValue(function(d) { return d; })
    .decorate(function(context, datum, index) {
        context.textAlign = 'center';
        context.fillStyle = '#000';
        context.font = '15px Arial';
        context.fillText(d3.format('.2f')(datum), 0, -10);
        // reset the fill style for the bar rendering
        context.fillStyle = '#999';
    });

canvasLine(data);
