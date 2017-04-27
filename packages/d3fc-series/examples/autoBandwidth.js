var width = 500;
var height = 250;
var container = d3.select('#bar-svg');

var data = [
  {x: 'fish', y: 25},
  {x: 'cat', y: 15},
  {x: 'dog', y: 35}
];

var xScale = d3.scaleBand()
    .domain(data.map(d => d.x))
    .paddingInner(0.2)
    .paddingOuter(0.1)
    .rangeRound([0, width]);

var yScale = d3.scaleLinear()
    .domain(fc.extentLinear().include([0])(data.map(d => d.y)))
    .range([height, 0]);

var svgBar = fc.autoBandwidth(fc.seriesSvgBar())
    .xScale(xScale)
    .yScale(yScale)
    .align('left')
    .crossValue(function(d) { return d.x; })
    .mainValue(function(d) { return d.y; });

container.append('g')
    .datum(data)
    .call(svgBar);

var canvas = d3.select('#bar-canvas').node();
canvas.width = width;
canvas.height = height;
var ctx = canvas.getContext('2d');

var canvasLine = fc.autoBandwidth(fc.seriesCanvasBar())
    .xScale(xScale)
    .yScale(yScale)
    .context(ctx)
    .align('left')
    .crossValue(function(d) { return d.x; })
    .mainValue(function(d) { return d.y; });
canvasLine(data);
