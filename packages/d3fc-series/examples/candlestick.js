var width = 500;
var height = 250;
var container = d3.select('#candlestick-svg');

var dataGenerator = fc.randomFinancial();
var data = dataGenerator(40);

var xScale = d3.scaleTime()
    .domain(fc.extentDate().accessors([function(d) { return d.date; }])(data))
    .range([0, width]);

var yScale = d3.scaleLinear()
    .domain(fc.extentLinear().accessors([function(d) { return d.high; }, function(d) { return d.low; }])(data))
    .range([height, 0]);

var svgCandlestick = fc.seriesSvgCandlestick()
    .xScale(xScale)
    .yScale(yScale);

container.append('g')
    .datum(data)
    .call(svgCandlestick);

var canvas = d3.select('#candlestick-canvas').node();
var ctx = canvas.getContext('2d');

var canvasCandlestick = fc.seriesCanvasCandlestick()
    .xScale(xScale)
    .yScale(yScale)
    .context(ctx);
canvasCandlestick(data);

var webgl = d3.select('#candlestick-webgl').node();
webgl.width = width;
webgl.height = height;
var gl = webgl.getContext('webgl');

var webglCandlestick = fc.seriesWebglCandlestick()
    .xScale(xScale)
    .yScale(yScale)
    .context(gl)
    .bandwidth(10)
    .lineWidth(2);
webglCandlestick(data);
