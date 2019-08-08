var width = 1600;
var height = 800;

const nSteps = 250;

var dataGenerator = fc.randomGeometricBrownianMotion().steps(nSteps);
var data = dataGenerator(10);

var d3XScale = d3
    .scaleLinear()
    .domain([0, nSteps])
    .range([0, width]);

var d3YScale = d3
    .scaleLinear()
    .domain([fc.extentLinear()(data)[0], fc.extentLinear()(data)[1]])
    .range([height, 0]);

var canvas = d3.select('#line-webgl').node();
canvas.width = width;
canvas.height = height;
var ctx = canvas.getContext('webgl');

var line = fc
    .seriesWebglLine()
    .xScale(d3XScale)
    .yScale(d3YScale)
    .context(ctx)
    .crossValue(function(_, i) {
        return i;
    })
    .mainValue(function(d) {
        return d;
    });

line(data);
