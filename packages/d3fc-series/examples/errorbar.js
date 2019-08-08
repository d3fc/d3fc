var width = 500;
var height = 250;
var container = d3.select('#errorbar-svg');

var dataGenerator = fc.randomGeometricBrownianMotion()
  .steps(10);
var data = dataGenerator(10)
    .map(function(datum, index) {
        var result = {
            value: index
        };
        result.high = datum + Math.random();
        result.low = datum - Math.random();
        return result;
    });

var xScale = d3.scaleLinear()
    .domain(fc.extentLinear().accessors([function(d) { return d.value; }])(data))
    .range([0, width]);

var yScale = d3.scaleLinear()
    .domain(fc.extentLinear().accessors([function(d) { return d.high; }, function(d) { return d.low; }])(data))
    .range([height, 0]);

var errorBar = fc.seriesSvgErrorBar()
    .xScale(xScale)
    .yScale(yScale)
    .crossValue(function(d) { return d.value; })
    .highValue(function(d) { return d.high; })
    .lowValue(function(d) { return d.low; });

container.append('g')
    .datum(data)
    .call(errorBar);

var canvas = d3.select('#errorbar-canvas').node();
canvas.width = width;
canvas.height = height;
var ctx = canvas.getContext('2d');

var canvasErrorBar = fc.seriesCanvasErrorBar()
    .context(ctx)
    .xScale(xScale)
    .yScale(yScale)
    .crossValue(function(d) { return d.value; })
    .highValue(function(d) { return d.high; })
    .lowValue(function(d) { return d.low; });
canvasErrorBar(data);

var webgl = d3.select('#errorbar-webgl').node();
webgl.width = width;
webgl.height = height;
var gl = webgl.getContext('webgl');

var webglErrorBar = fc.seriesWebglErrorBar()
    .context(gl)
    .xScale(xScale)
    .yScale(yScale)
    .crossValue(function(d) { return d.value; })
    .highValue(function(d) { return d.high; })
    .lowValue(function(d) { return d.low; });
webglErrorBar(data);
