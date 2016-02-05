var width = 500, height = 250;
var container = d3.select('#multi')
    .append('svg')
    .attr({'width': width, 'height': height});

var dataGenerator = fc.data.random.financial()
    .startDate(new Date(2014, 1, 1));
var data = dataGenerator(50);

var xScale = fc.scale.dateTime()
    .domain(fc.util.extent().pad(0.1).fields('date')(data))
    .range([0, width]);

var yScale = d3.scale.linear()
    .domain(fc.util.extent().pad(0.4).fields(['high', 'low'])(data))
    .range([height, 0]);

//START
var candlestick = fc.series.candlestick();
var gridlines = fc.annotation.gridline();

// Create a a bollinger series
var bollingerAlgorithm = fc.indicator.algorithm.bollingerBands();
bollingerAlgorithm(data);
var bollinger = fc.indicator.renderer.bollingerBands();

var multi = fc.series.multi()
    .series([gridlines, bollinger, candlestick])
    .xScale(xScale)
    .yScale(yScale);

container.append('g')
    .datum(data)
    .call(multi);
//END
