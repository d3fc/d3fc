var width = 500, height = 250;
var container = d3.select('#rsi')
    .append('svg')
    .attr({'width': width, 'height': height});

var dataGenerator = fc.data.random.financial()
    .startDate(new Date(2014, 1, 1));
var data = dataGenerator(50);

var xScale = fc.scale.dateTime()
    .domain(fc.util.extent().fields(['date'])(data))
    .range([0, width]);

//START
// the RSI is output on a percentage scale, so requires a domain from 0 - 100
var yScale = d3.scale.linear()
      .domain([0, 100])
      .range([height, 0]);

// Create and apply the RSI algorithm
var rsiAlgorithm = fc.indicator.algorithm.relativeStrengthIndex();
rsiAlgorithm(data);

// Create the renderer
var rsi = fc.indicator.renderer.relativeStrengthIndex()
    .xScale(xScale)
    .yScale(yScale);

// Add it to the container
container.append('g')
    .datum(data)
    .call(rsi);
//END
