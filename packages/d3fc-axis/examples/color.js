var width = 400;
var margin = 10;

var scale = d3.scaleLinear()
  .domain([0, 140])
  .range([margin, width - margin])
  .nice();

var axis = fc.axisBottom(scale)
  .decorate(function(s) {
    s.enter()
      .select('text')
      .style('fill', function(d) {
          return d >= 100 ? 'red' : 'black';
      });
  });

var svg = d3.select('body').append('svg')
    .attr('width', width)
    .attr('height', 80);
svg.append('g')
    .attr('transform', 'translate(0, 10)')
    .call(axis);
