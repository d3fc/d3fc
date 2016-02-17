var width = 500, height = 250;
var container = d3.select('#decorate-bars')
    .append('svg')
    .attr({'width': width, 'height': height});

var dataGenerator = fc.data.random.financial()
    .startDate(new Date(2014, 1, 1));
var data = dataGenerator(20);

var xScale = fc.scale.dateTime()
    .domain(fc.util.extent().fields('date').pad(0.1)(data))
    .range([0, width]);

var yScale = d3.scale.linear()
    .domain(fc.util.extent().fields(['high', 'low'])(data))
    .range([height, 0]);

//START
var color = d3.scale.category10();

var bar = fc.series.bar()
    .xScale(xScale)
    .yScale(yScale)
    .xValue(function(d) { return d.date; })
    .yValue(function(d) { return d.close; })
    .decorate(function(s) {
        s.enter()
          .select('.bar > path')
          .style('fill', function(d, i) {
              return color(i);
          });
    });
//END

container.append('g')
    .datum(data)
    .call(bar);
