var width = 500, height = 250;
var container = d3.select('#envelope2')
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

// Create the candlestick series
var candlestick = fc.series.candlestick();

// Create and apply the EMA
var movingAverage = fc.indicator.algorithm.exponentialMovingAverage();
movingAverage(data);

// Create a line that renders the result
var emaLine = fc.series.line()
    .yValue(function(d) { return d.exponentialMovingAverage; });

// Create and apply the envelope algorithm to the exponential moving average
var envelopeAlgorithm = fc.indicator.algorithm.envelope()
    .factor(0.01)
    .value(function(d) { return d.exponentialMovingAverage; });
envelopeAlgorithm(data);

// Create the renderer
var envelopeArea = fc.indicator.renderer.envelope();

// create a multi-series to render the various components
var multi = fc.series.multi()
  .series([envelopeArea, emaLine, candlestick])
  .xScale(xScale)
  .yScale(yScale);

container.append('g')
    .datum(data)
    .call(multi);
