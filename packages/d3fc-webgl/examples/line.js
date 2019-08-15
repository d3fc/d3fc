var width = 1600;
var height = 800;

const nSteps = 250;

var dataGenerator = fc.randomGeometricBrownianMotion()
  .steps(nSteps);
var data = dataGenerator(10);

var d3XScale = d3.scaleLinear()
    .domain([0, nSteps])
    .range([0, width]);

var d3YScale = d3.scaleLinear()
    .domain([fc.extentLinear()(data)[0], fc.extentLinear()(data)[1]])
    .range([height, 0]);

var xScale = fc.scaleMapper(d3XScale);
var yScale = fc.scaleMapper(d3YScale);

var canvas = d3.select('#line-webgl').node();
canvas.width = width;
canvas.height = height;
var ctx = canvas.getContext('webgl');

// var xValues = new Float32Array(data.length);
// var yValues = new Float32Array(data.length);

// data.map((d, i) => {
//     xValues[i] = i;
//     yValues[i] = d;
// });

// var line = fc.glLine();

const lineWidth = 16;

// line.context(ctx)
//     .xValues(xValues)
//     .yValues(yValues)
//     .width(lineWidth)
//     .xScale(xScale.glScale)
//     .yScale(yScale.glScale)
//     .decorate(program => {
//         fc.circleFill().color([0, 0, 1, 1])(program);
//     });

// line(data.length);

var line = fc.seriesWebglLine()
    .xScale(d3XScale)
    .yScale(d3YScale)
    .context(ctx)
    .crossValue(function(_, i) { return i; })
    .mainValue(function(d) { return d; });

line(data);

var canvas2 = d3.select('#line-canvas').node();
canvas2.width = width;
canvas2.height = height;
var ctx2 = canvas2.getContext('2d');

var canvasLine = fc.seriesCanvasLine()
    .xScale(d3XScale)
    .yScale(d3YScale)
    .context(ctx2)
    .crossValue(function(_, i) { return i; })
    .mainValue(function(d) { return d; })
    .decorate((ctx, d) => {
        ctx.lineWidth = lineWidth / 2; ctx.strokeStyle = '#ff0000'; ctx.globalAlpha = 0.5;
    });
canvasLine(data);
