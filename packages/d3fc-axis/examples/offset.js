var width = 400;
var margin = 10;

var scale = d3.scaleBand()
  .domain(['Carrots', 'Bananas', 'Sausages', 'Pickles', 'Aubergines', 'Artichokes', 'Spinach', 'Cucumber'])
  .range([margin, width - margin]);

var axis = fc.axisBottom(scale)
  .decorate(function(s) {
    s.enter().select('text')
      .attr('transform', function(d, i) {
          return 'translate(0, ' + (i % 2 === 0 ? 20 : 10) + ')';
      });
  });

var svg = d3.select('body').append('svg')
    .attr('width', width)
    .attr('height', 80);
svg.append('g')
    .attr('transform', 'translate(0, 10)')
    .call(axis);
