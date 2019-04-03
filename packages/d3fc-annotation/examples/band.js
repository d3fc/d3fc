/* global xScale, yScale, render */
var horizontalSvgBand = fc.annotationSvgBand()
  .xScale(xScale)
  .yScale(yScale)
  .fromValue(function(d) { return d[0]; })
  .toValue(function(d) { return d[1]; });

var verticalSvgBand = fc.annotationSvgBand()
  .orient('vertical')
  .xScale(xScale)
  .yScale(yScale)
  .fromValue(function(d) { return d[0]; })
  .toValue(function(d) { return d[1]; });

var horizontalCanvasBand = fc.annotationCanvasBand()
  .xScale(xScale)
  .yScale(yScale)
  .fromValue(function(d) { return d[0]; })
  .toValue(function(d) { return d[1]; })
  .decorate(context => { context.fillStyle = 'rgba(102, 0, 204, 0.1)'; });

var verticalCanvasBand = fc.annotationCanvasBand()
  .orient('vertical')
  .xScale(xScale)
  .yScale(yScale)
  .fromValue(function(d) { return d[0]; })
  .toValue(function(d) { return d[1]; })
  .decorate(context => { context.fillStyle = 'rgba(0, 204, 0, 0.1)'; });

// eslint-disable-next-line no-unused-vars
function renderComponent() {
    const data = [[0.1, 0.15], [0.2, 0.3], [0.4, 0.6], [0.8, 0.9]];
    var svg = d3.select('svg')
      .datum(data);
    svg.select('.horizontal')
      .call(horizontalSvgBand);
    svg.select('.vertical')
      .call(verticalSvgBand);

    var canvas = d3.select('canvas').node();
    var ctx = canvas.getContext('2d');
    horizontalCanvasBand.context(ctx)(data);
    verticalCanvasBand.context(ctx)(data);
}

render();
