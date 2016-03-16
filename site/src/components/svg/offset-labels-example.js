var width = 500;

var ordinalScale = d3.scale.ordinal()
  .domain(['Carrots', 'Bananas', 'Sausages', 'Pickles', 'Aubergines', 'Artichokes', 'Spinach', 'Cucumber'])
  .rangePoints([0, width], 1);

//START
var axis = fc.svg.axis()
  .scale(ordinalScale)
  .decorate(function(s) {
      s.enter().select('text')
        .attr('transform', function(d, i) {
            return 'translate(0, ' + (i % 2 === 0 ? 25 : 10) + ')';
        });
  });

d3.select('#example-two')
    .style('width', width)
    .call(axis);
//END
