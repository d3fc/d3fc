var width = 400;
var margin = 10;

var scale = d3.scaleBand()
  .domain(['Carrots', 'Bananas', 'Sausages', 'Pickles', 'Aubergines', 'Artichokes', 'Spinach', 'Cucumber'])
  .range([margin, width - margin]);

var linear = d3.scaleTime()
  .domain([new Date('2019-03-02'), new Date('2019-03-07')])
  .range([margin, width - margin]);

var bands = d3.scaleBand()
  .domain(['Carrots', 'Bananas', 'Sausages', 'Pickles'])
  .range([margin, width - margin]);

var axis = fc.axisBottom(scale)
  .decorate(function(s) {
      s.enter().select('text')
        .attr('transform', function(d, i) {
            return 'translate(0, ' + (i % 2 === 0 ? 20 : 10) + ')';
        });
  });

var axisLinear = fc.axisBottom(linear)
    .tickArguments([5])
    .tickCenterLabel(true)
    .tickPadding(5)
    .tickSizeInner(10);

var axisBetweenTicks = fc.axisOrdinalBottom(bands)
    .tickPadding(5)
    .tickSizeInner(10);

var svg = d3.select('body').append('svg')
    .attr('width', width)
    .attr('height', 200);
svg.append('g')
    .attr('transform', 'translate(0, 10)')
    .call(axis);
svg.append('g')
    .attr('transform', 'translate(0, 80)')
    .call(axisLinear);
svg.append('g')
    .attr('transform', 'translate(0, 140)')
    .call(axisBetweenTicks);
