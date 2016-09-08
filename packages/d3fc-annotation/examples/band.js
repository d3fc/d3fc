/* global xScale, yScale, render */
var horizontalBand = fc.annotationBand()
  .xScale(xScale)
  .yScale(yScale)
  .fromValue(function(d) { return d[0]; })
  .toValue(function(d) { return d[1]; });

var verticalBand = fc.annotationBand()
  .orient('vertical')
  .xScale(xScale)
  .yScale(yScale)
  .fromValue(function(d) { return d[0]; })
  .toValue(function(d) { return d[1]; });

// eslint-disable-next-line no-unused-vars
function renderComponent() {
    var svg = d3.select('svg')
      .datum([[0.1, 0.15], [0.2, 0.3], [0.4, 0.6], [0.8, 0.9]]);
    svg.select('.horizontal')
      .call(horizontalBand);
    svg.select('.vertical')
      .call(verticalBand);
}

render();
