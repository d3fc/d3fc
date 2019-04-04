/* global xScale, yScale, render */
var horizontalSvgLine = fc.annotationSvgLine()
  .label('')
  .xScale(xScale)
  .yScale(yScale);

var verticalSvgLine = fc.annotationSvgLine()
  .orient('vertical')
  .label('')
  .xScale(xScale)
  .yScale(yScale);

var horizontalCanvasLine = fc.annotationCanvasLine()
  .xScale(xScale)
  .yScale(yScale)
  .decorate(ctx => {
      ctx.fillStyle = 'rgba(204, 0, 0, 0.7)';
      ctx.strokeStyle = '#c60';
  });

var verticalCanvasLine = fc.annotationCanvasLine()
  .orient('vertical')
  .xScale(xScale)
  .yScale(yScale)
  .decorate(ctx => {
      ctx.fillStyle = 'rgba(204, 0, 0, 0.7)';
      ctx.strokeStyle = '#06c';
  });

// eslint-disable-next-line no-unused-vars
function renderComponent() {
    var svg = d3.select('svg');
    svg.select('.horizontal')
      .datum([0.15, 0.85])
      .call(horizontalSvgLine);
    svg.select('.vertical')
      .datum([0.2, 0.4, 0.6, 0.8])
      .call(verticalSvgLine);

    var canvas = d3.select('canvas').node();
    var ctx = canvas.getContext('2d');
    horizontalCanvasLine.context(ctx)([0.15, 0.85]);
    verticalCanvasLine.context(ctx)([0.2, 0.4, 0.6, 0.8]);
}

render();
