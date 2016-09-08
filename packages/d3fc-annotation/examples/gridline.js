/* global xScale, yScale, render */
var gridline = fc.annotationGridline()
  .xScale(xScale)
  .yScale(yScale);

// eslint-disable-next-line no-unused-vars
function renderComponent() {
    d3.select('svg')
      .call(gridline);
}

render();
