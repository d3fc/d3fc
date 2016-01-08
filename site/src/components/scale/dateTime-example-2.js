var width = 500, height = 150;
var container = d3.select('#datetime-skip')
    .append('svg')
    .attr({'width': width, 'height': height});

var dataGenerator = fc.data.random.financial()
    .filter(fc.data.random.filter.skipWeekends())
    .startDate(new Date(2014, 1, 1));
var data = dataGenerator(15);

var yScale = d3.scale.linear()
    .domain(fc.util.extent().fields(['high', 'low'])(data))
    .range([height, 50]);

//START
var dateScale = fc.scale.dateTime()
    .domain(fc.util.extent().fields('date')(data))
    .discontinuityProvider(fc.scale.discontinuity.skipWeekends())
    .range([0, width]);
//END

// create a D3 axis to render the scale
var dateAxis = d3.svg.axis()
    .scale(dateScale)
    .orient('bottom');

// create a series, to illustrate
var point = fc.series.point()
    .xScale(dateScale)
    .yScale(yScale);

// render both
container.append('g')
      .datum(data)
      .call(point);

container.append('g')
      .attr('transform', 'translate(0, 80)')
      .classed('axis', true)
      .call(dateAxis);
