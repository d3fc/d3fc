/* global renderComponent */
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

// eslint-disable-next-line no-unused-vars
function render() {
    var svg = d3.select('svg');

    xAxisJoin(svg, function(d) { return [d]; })
      .attr('transform', 'translate(0, ' + (height - 20) + ')')
      .call(xAxis);

    yAxisJoin(svg, function(d) { return [d]; })
      .attr('transform', 'translate(' + (width - 30) + ', 0)')
      .call(yAxis);

    if (typeof renderComponent === 'function') {
        renderComponent();
    }
}
