var width = 500, height = 250;
var container = d3.select('#envelope')
    .append('svg')
    .attr({'width': width, 'height': height});

var dataGenerator = fc.data.random.financial()
    .startDate(new Date(2014, 1, 1));
var data = dataGenerator(50);

var xScale = fc.scale.dateTime()
    .domain(fc.util.extent().fields('date')(data))
    .range([0, width]);

var yScale = d3.scale.linear()
    .domain(fc.util.extent().pad(0.4).fields(['high', 'low'])(data))
    .range([height, 0]);

// Create the line series
var line = fc.series.line()
    .xScale(xScale)
    .yScale(yScale);

container.append('g')
    .datum(data)
    .call(line);

// Create and apply the envelope algorithm
var envelopeAlgorithm = fc.indicator.algorithm.envelope()
    .factor(0.01)
    .value(function(d) { return d.close; });
envelopeAlgorithm(data);

// Create the renderer
var envelope = fc.indicator.renderer.envelope()
    .xScale(xScale)
    .yScale(yScale);

// Add it to the container
container.append('g')
    .datum(data)
    .call(envelope);
