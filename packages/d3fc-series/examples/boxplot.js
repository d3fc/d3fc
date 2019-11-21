var width = 500;
var height = 250;
var container = d3.select('#boxplot-svg');

var dataGenerator = fc.randomGeometricBrownianMotion()
  .steps(10);
var data = dataGenerator()
    .map(function(datum, index) {
        var result = {
            value: index
        };
        result.median = 10 + Math.random();
        result.upperQuartile = result.median + Math.random();
        result.lowerQuartile = result.median - Math.random();
        result.high = result.upperQuartile + Math.random();
        result.low = result.lowerQuartile - Math.random();
        return result;
    });

var xScale = d3.scaleLinear()
    .domain(fc.extentLinear().accessors([function(d) { return d.value; }])(data))
    .range([0, width]);

var yScale = d3.scaleLinear()
    .domain(fc.extentLinear().accessors([function(d) { return d.high; }, function(d) { return d.low; }])(data))
    .range([height, 0]);

var boxPlot = fc.autoBandwidth(fc.seriesSvgBoxPlot())
    .xScale(xScale)
    .yScale(yScale)
    .crossValue(function(d) { return d.value; })
    .medianValue(function(d) { return d.median; })
    .upperQuartileValue(function(d) { return d.upperQuartile; })
    .lowerQuartileValue(function(d) { return d.lowerQuartile; })
    .highValue(function(d) { return d.high; })
    .lowValue(function(d) { return d.low; });

container.append('g')
    .datum(data)
    .call(boxPlot);

var canvas = d3.select('#boxplot-canvas').node();
canvas.width = width;
canvas.height = height;
var ctx = canvas.getContext('2d');

var canvasBoxPlot = fc.autoBandwidth(fc.seriesCanvasBoxPlot())
    .context(ctx)
    .xScale(xScale)
    .yScale(yScale)
    .crossValue(function(d) { return d.value; })
    .medianValue(function(d) { return d.median; })
    .upperQuartileValue(function(d) { return d.upperQuartile; })
    .lowerQuartileValue(function(d) { return d.lowerQuartile; })
    .highValue(function(d) { return d.high; })
    .lowValue(function(d) { return d.low; });
canvasBoxPlot(data);

var webgl = d3.select('#boxplot-webgl').node();
webgl.width = width;
webgl.height = height;
var gl = webgl.getContext('webgl');

var webglBoxPlot = fc.autoBandwidth(fc.seriesWebglBoxPlot())
    .context(gl)
    .xScale(xScale)
    .yScale(yScale)
    .crossValue(function(d) { return d.value; })
    .medianValue(function(d) { return d.median; })
    .upperQuartileValue(function(d) { return d.upperQuartile; })
    .lowerQuartileValue(function(d) { return d.lowerQuartile; })
    .highValue(function(d) { return d.high; })
    .lowValue(function(d) { return d.low; });
webglBoxPlot(data);
