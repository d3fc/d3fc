var width = 500;
var height = 250;

var xScale = d3.scaleLinear()
  .range([10, width - 10]);

var yScale = d3.scaleLinear()
  .range([10, height - 10]);

var gridline = fc.annotationGridline()
  .xScale(xScale)
  .yScale(yScale);

function render() {
    d3.select('svg')
      .call(gridline);
    requestAnimationFrame(render);
}

render();
