var width = 500;
var height = 250;

var xScale = d3.scaleLinear()
  .domain([0, 1])
  .range([0, width - 50]);

var yScale = d3.scaleLinear()
  .domain([0, 1])
  .range([0, height - 50]);

var gridline = fc.annotationGridline()
  .xScale(xScale)
  .yScale(yScale);

function render() {
    d3.select('svg')
      .call(gridline);
    requestAnimationFrame(render);
}

render();
