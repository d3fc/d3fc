var width = 500, height = 250;
var container = d3.select('#bollinger')
    .append('svg')
    .attr({'width': width, 'height': height});

var dataGenerator = fc.data.random.financial()
    .startDate(new Date(2014, 1, 1));
var data = dataGenerator(50);

var xScale = fc.scale.dateTime()
    .domain(fc.util.extent().fields(['date'])(data))
    .range([0, width]);

var yScale = d3.scale.linear()
    .domain(fc.util.extent().pad(0.4).fields(['high', 'low'])(data))
    .range([height, 0]);

// Create the point series
var point = fc.series.point()
    .xScale(xScale)
    .yScale(yScale);

container.append('g')
    .datum(data)
    .call(point);

// START
// Create and apply the bollinger algorithm
var bollingerAlgorithm = fc.indicator.algorithm.bollingerBands();
bollingerAlgorithm(data);

// Create the renderer
var bollinger = fc.indicator.renderer.bollingerBands()
    .xScale(xScale)
    .yScale(yScale);

// Add it to the container
container.append('g')
    .datum(data)
    .call(bollinger);
// END
