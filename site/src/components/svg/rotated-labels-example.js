var width = 500;

var linearScale = d3.scale.linear()
  .domain([0, 140])
  .range([0, width])
  .nice();

var ordinalScale = d3.scale.ordinal()
  .domain(['Carrots', 'Bananas', 'Sausages', 'Pickles', 'Aubergines', 'Artichokes', 'Spinach', 'Cucumber'])
  .rangePoints([0, width], 1);

//START
var axis = fc.svg.axis()
  .scale(ordinalScale)
  .decorate(function(s) {
      s.enter().select('text')
        .style('text-anchor', 'start')
        .attr('transform', 'rotate(45 -10 10)');
  });

d3.select('#example-one')
    .style('width', width)
    .call(axis);
//END
