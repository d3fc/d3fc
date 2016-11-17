var width = 500;
var height = 250;

var xScale = d3.scaleLinear()
  .domain([0, 1])
  .range([10, width - 30]);

var yScale = d3.scaleLinear()
  .domain([0, 1])
  .range([5, height - 20]);

var xAxis = d3.axisBottom(xScale);
var yAxis = d3.axisRight(yScale);

var xAxisJoin = fc.dataJoin('g', 'x-axis');
var yAxisJoin = fc.dataJoin('g', 'y-axis');

var gridline = fc.annotationSvgGridline()
  .xScale(xScale)
  .yScale(yScale);

function render() {
    var svg = d3.select('svg')
      .transition()
      .duration(1000)
      .ease(d3.easeLinear);

    xScale.domain([0, Math.random() * 100]);
    yScale.domain([0, Math.random() * 100]);

    xAxisJoin(svg, function(d) { return [d]; })
      .attr('transform', 'translate(0, ' + (height - 20) + ')')
      .call(xAxis);

    yAxisJoin(svg, function(d) { return [d]; })
      .attr('transform', 'translate(' + (width - 30) + ', 0)')
      .call(yAxis);

    svg.call(gridline);
}

render();
setInterval(render, 1100);
