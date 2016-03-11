var width = 500, height = 250;
var container = d3.select('#line')
    .append('svg')
    .attr({'width': width, 'height': height});

var dataGenerator = fc.data.random.financial()
    .startDate(new Date(2014, 1, 1));
var data = dataGenerator(50);

var xScale = fc.scale.dateTime()
    .domain(fc.util.extent().fields(['date'])(data))
    .range([0, width]);

var yScale = d3.scale.linear()
    .domain(fc.util.extent().fields(['high', 'low'])(data))
    .range([height, 0])
    .nice();

//START
var lineAnnotation = fc.annotation.line()
  .xScale(xScale)
  .yScale(yScale);

// create an array that contains the highest, lowest and most recent price
var priceMarkers = [
    data[data.length - 1].close,
    d3.min(data, function(d) { return d.high; }),
    d3.max(data, function(d) { return d.low; })
];

container.append('g')
  .datum(priceMarkers)
  .call(lineAnnotation);
//END
