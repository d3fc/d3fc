var width = 500;
var height = 250;
var margin = 10;
var container = d3.select('#decorate-svg');

var dataGenerator = fc.randomGeometricBrownianMotion()
  .steps(15);
var data = dataGenerator(1);

var xScale = d3.scaleLinear()
    .domain([0, data.length])
    .range([margin, width - margin * 2]);

var yScale = d3.scaleLinear()
    .domain(fc.extentLinear()(data))
    .range([height, 0]);

var color = d3.scaleOrdinal(d3.schemeCategory10);

var svgBar = fc.seriesSvgBar()
    .xScale(xScale)
    .yScale(yScale)
    .crossValue(function(_, i) { return i; })
    .mainValue(function(d) { return d; })
    .decorate(function(selection) {
        selection.enter()
          .style('fill', function(d, i) {
              return color(i);
          });
    });

container.append('g')
    .datum(data)
    .call(svgBar);
