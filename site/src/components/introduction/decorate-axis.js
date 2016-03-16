var width = 500, height = 100;
var container = d3.select('#decorate-axis')
    .append('svg')
    .attr({'style': 'margin-top: 100px', 'width': width, 'height': height});

var ordinalScale = d3.scale.ordinal()
  .domain(['Carrots', 'Bananas', 'Sausages', 'Pickles', 'Aubergines', 'Artichokes', 'Spinach', 'Cucumber'])
  .rangePoints([0, width], 1);

//START
var axis = fc.svg.axis()
  .scale(ordinalScale)
  .decorate(function(s) {
      s.enter()
        .select('text')
        .style('text-anchor', 'start')
        .attr('transform', 'rotate(45 -10 10)');
  });
//END

container
  .call(axis);
