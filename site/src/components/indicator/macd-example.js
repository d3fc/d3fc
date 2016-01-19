var width = 500, height = 250;
var container = d3.select('#macd')
    .append('svg')
    .attr({'width': width, 'height': height});

var dataGenerator = fc.data.random.financial()
    .startDate(new Date(2014, 1, 1));
var data = dataGenerator(50);

var xScale = fc.scale.dateTime()
    .domain(fc.util.extent().fields('date')(data))
    .range([0, width]);

var yScale = d3.scale.linear()
    .domain(fc.util.extent().fields(['high', 'low'])(data))
    .range([height, 0]);

// Create and apply the macd algorithm
var macdAlgorithm = fc.indicator.algorithm.macd()
    .fastPeriod(4)
    .slowPeriod(10)
    .signalPeriod(5);
macdAlgorithm(data);

// the MACD is rendered on its own scale, centered around zero
var yDomain = fc.util.extent()
    .fields(function(d) { return d.macd.macd; })
    .symmetricalAbout(0);

var yScale = d3.scale.linear()
    .domain(yDomain(data))
    .range([height, 0]);

// Create the renderer
var macd = fc.indicator.renderer.macd()
    .xScale(xScale)
    .yScale(yScale);

// Add it to the container
container.append('g')
    .datum(data)
    .call(macd);
