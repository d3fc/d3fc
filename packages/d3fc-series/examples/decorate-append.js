var width = 500;
var height = 250;
var margin = 15;
var container = d3.select('#decorate-svg');

var dataGenerator = fc.randomGeometricBrownianMotion()
  .steps(10);
var data = dataGenerator(1);

var xScale = d3.scaleLinear()
    .domain([0, data.length])
    .range([margin, width - margin * 2]);

var yScale = d3.scaleLinear()
    .domain(fc.extentLinear().pad([0.1, 0.1])(data))
    .range([height, 0]);

var color = d3.scaleOrdinal(d3.schemeCategory10);

var svgBar = fc.seriesSvgBar()
    .xScale(xScale)
    .yScale(yScale)
    .crossValue(function(_, i) { return i; })
    .mainValue(function(d) { return d; })
    .decorate(function(selection) {
        selection.enter()
            .append('text')
            .style('text-anchor', 'middle')
            .attr('transform', 'translate(0, -10)')
            .text(function(d) { return d3.format('.2f')(d); })
            .attr('fill', 'black');
    });

container.append('g')
    .datum(data)
    .call(svgBar);
