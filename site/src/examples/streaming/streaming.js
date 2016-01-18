// create some test data
var generator = fc.data.random.financial();
var data = generator(110);

function renderChart() {
    // add a new datapoint and remove an old one
    var datum = generator(1)[0];
    data.push(datum);
    data.shift();

    // Offset the range to include the full bar for the latest value
    var dateRange = fc.util.extent().fields('date')(data);
    dateRange[1] = d3.time.day.offset(dateRange[1], 1);

    // create a chart
    var chart = fc.chart.cartesian(
        fc.scale.dateTime(),
        d3.scale.linear()
      )
     .xDomain(dateRange)
     .xTicks(5)
     .yNice()
     .yTicks(5);

    // compute the bollinger bands and update the y-axis domain
    var bollingerAlgorithm = fc.indicator.algorithm.bollingerBands();
    bollingerAlgorithm(data);

    chart.yDomain(fc.util.extent().fields([
        function(d) { return d.bollingerBands.upper; },
        function(d) { return d.bollingerBands.lower; }
    ])(data));

    // Create the gridlines and series
    var gridlines = fc.annotation.gridline();
    var candlestick = fc.series.candlestick();
    var bollingerBands = fc.indicator.renderer.bollingerBands();

    // add them to the chart via a multi-series
    var multi = fc.series.multi()
     .series([gridlines, bollingerBands, candlestick]);
    chart.plotArea(multi);

    d3.select('#streaming-chart')
     .datum(data)
     .call(chart);
}
renderChart();

//setInterval(renderChart, 200);
