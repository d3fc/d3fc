/* global xScale, yScale, xAxis, yAxis, render */
xAxis.tickFormat('');
yAxis.tickFormat('');

var crosshairSvg = fc.annotationSvgCrosshair()
  .xScale(xScale)
  .yScale(yScale)
  .xLabel(function(d) {
      var format = d3.format('.2f');
      var value = xScale.invert(d.x);
      return format(value);
  })
  .yLabel(function(d) {
      var format = d3.format('.2f');
      var value = yScale.invert(d.y);
      return format(value);
  })
  .decorate(function(g) {
      g.selectAll('.point>path')
        .attr('transform', 'scale(10)');
  });

var crosshairCanvas = fc.annotationCanvasCrosshair()
  .xScale(xScale)
  .yScale(yScale)
  .xLabel(function(d) {
      var format = d3.format('.2f');
      var value = xScale.invert(d.x);
      return format(value);
  })
  .yLabel(function(d) {
      var format = d3.format('.2f');
      var value = yScale.invert(d.y);
      return format(value);
  });

var svgData = [{ x: 215, y: 106 }];
var canvasData = [{ x: 215, y: 106 }];

// eslint-disable-next-line no-unused-vars
function renderComponent() {
    d3.select('svg')
      .datum(svgData)
      .call(crosshairSvg)
      .on('mousemove', function() {
          var point = d3.mouse(this);
          svgData[0] = { x: point[0], y: point[1] };
          render();
      });

    var canvas = d3.select('canvas').node();
    var ctx = canvas.getContext('2d');
    crosshairCanvas.context(ctx)(canvasData);
}

render();
