// hide-start
// a random number generator
var generator = fc.randomGeometricBrownianMotion()
    .steps(11);

// some formatters
var dateFormatter = d3.timeFormat('%b');

// randomly generated sales data starting at one
var data = generator(1).map(function(d, i) {
  return {
    month: dateFormatter(new Date(0, i + 1, 0)),
    sales: d + i / 2
  };
});

// hide-end
// create an svg
var width = 500;
var height = 250;
var container = d3.select('#rendered-series')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

// create the scales
var xScale = d3.scalePoint()
    .domain(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'])
    .range([0, width])
    .padding(0.5);

var yScale = d3.scaleLinear()
    .domain([0, 10])
    .range([height, 0]);

// create a series
var series = fc.seriesSvgBar()
    .bandwidth(40)
    .crossValue(function(d) { return d.month; })
    .mainValue(function(d) { return d.sales; })
    .xScale(xScale)
    .yScale(yScale);

// render
container
    .datum(data)
    .call(series);