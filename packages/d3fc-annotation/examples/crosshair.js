/* global xScale, yScale, xAxis, yAxis, render */
xAxis.tickFormat('');
yAxis.tickFormat('');

var crosshair = fc.annotationSvgCrosshair()
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

var data = [{ x: 215, y: 106 }];

// eslint-disable-next-line no-unused-vars
function renderComponent() {
    d3.select('svg')
      .datum(data)
      .call(crosshair)
      .on('mousemove', function() {
          var point = d3.mouse(this);
          data[0] = { x: point[0], y: point[1] };
      });
}

render();
