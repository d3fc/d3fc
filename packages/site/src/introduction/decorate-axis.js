var width = 500;
var height = 100;
var container = d3.select('#decorate-axis')
    .append('svg')
    .attr('style', 'margin-top: 100px')
    .attr('width', width)
    .attr('height', height);

var scaleBand = d3.scaleBand()
  .domain(['Carrots', 'Bananas', 'Sausages', 'Pickles', 'Aubergines', 'Artichokes', 'Spinach', 'Cucumber'])
  .range([0, width]);

// START
var axis = fc.axisBottom()
  .scale(scaleBand)
  .decorate(function(s) {
    s.enter()
        .select('text')
        .style('text-anchor', 'start')
        .attr('transform', 'rotate(45 -10 10)');
  });
// END

container
  .call(axis);
