/* global xScale, yScale, render */
var gridline = fc.annotationSvgGridline()
  .xScale(xScale)
  .yScale(yScale);

var gridlineCanvas = fc.annotationCanvasGridline()
  .xScale(xScale)
  .yScale(yScale);

// eslint-disable-next-line no-unused-vars
function renderComponent() {
    d3.select('svg')
      .call(gridline);

    var canvas = d3.select('canvas').node();
    var ctx = canvas.getContext('2d');
    gridlineCanvas.context(ctx)();
}

render();
