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
  .scale(linearScale)
  .decorate(function(s) {
      s.enter()
        .select('text')
        .style('fill', function(d) {
            return d >= 100 ? 'red' : 'black';
        });
  });

d3.select('#example-three')
    .style('width', width)
    .call(axis);
//END
