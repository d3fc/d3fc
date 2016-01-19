// create some test data
var generator = fc.data.random.financial();
var data = generator(110);

function renderChart() {
    // add a new datapoint and remove an old one
    var datum = generator(1)[0];
    data.push(datum);
    data.shift();

    // compute the bollinger bands
    var bollingerAlgorithm = fc.indicator.algorithm.bollingerBands();
    bollingerAlgorithm(data);

    // Offset the range to include the full bar for the latest value
    var xExtent = fc.util.extent()
        .fields('date')
        .padUnit('domain')
        .pad([0, 1000 * 60 * 60 * 24]);

    // ensure y extent includes the bollinger bands
    var yExtent = fc.util.extent().fields([
        function(d) { return d.bollingerBands.upper; },
        function(d) { return d.bollingerBands.lower; }
    ]);

    // create a chart
    var chart = fc.chart.cartesian(
        fc.scale.dateTime(),
        d3.scale.linear()
      )
     .xDomain(xExtent(data))
     .yDomain(yExtent(data))
     .xTicks(5)
     .yNice()
     .yTicks(5);

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

// re-render the chart every 200ms
renderChart();
var intervalId = setInterval(renderChart, 200);
