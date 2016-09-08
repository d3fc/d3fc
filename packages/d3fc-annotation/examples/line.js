/* global xScale, yScale, render */
var horizontalLine = fc.annotationSvgLine()
  .label('')
  .xScale(xScale)
  .yScale(yScale);

var verticalLine = fc.annotationSvgLine()
  .orient('vertical')
  .label('')
  .xScale(xScale)
  .yScale(yScale);

// eslint-disable-next-line no-unused-vars
function renderComponent() {
    var svg = d3.select('svg');
    svg.select('.horizontal')
      .datum([0.15, 0.85])
      .call(horizontalLine);
    svg.select('.vertical')
      .datum([0.2, 0.4, 0.6, 0.8])
      .call(verticalLine);
}

render();
