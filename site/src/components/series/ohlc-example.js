var width = 500, height = 250;
var container = d3.select('#ohlc')
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

//START
var candlestick = fc.series.ohlc()
    .xScale(xScale)
    .yScale(yScale);

container.append('g')
    .datum(data)
    .call(candlestick);
//END
