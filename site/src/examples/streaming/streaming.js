// create some test data
var stream = fc.data.random.financial().stream();
var data = stream.take(110);

function renderChart() {
    // add a new datapoint and remove an old one
    data.push(stream.next());
    data.shift();

    // compute the bollinger bands
    var bollingerAlgorithm = fc.indicator.algorithm.bollingerBands();
    bollingerAlgorithm(data);

    // Offset the range to include the full bar for the latest value
    var DAY_MS = 1000 * 60 * 60 * 24;
    var xExtent = fc.util.extent()
        .fields(['date'])
        .padUnit('domain')
        .pad([DAY_MS * -bollingerAlgorithm.windowSize()(data), DAY_MS]);

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
     .yNice()
     .chartLabel('Streaming Candlestick')
     .margin({left: 30, right: 30, bottom: 20, top: 30});

    // obtain ticks from the underlying scales
    var xTicks = chart.xScaleTicks(10);
    var yTicks = chart.yScaleTicks(10);

    // render a reduced number of ticks on each axis
    chart.xTickValues(xTicks.filter(function(d) { return d.getDate() % 2 === 0; }))
        .yTickValues(yTicks.filter(function(d, i) { return i % 2 === 0; }));

    // Create the gridlines and series
    var gridlines = fc.annotation.gridline()
        .xTickValues(xTicks)
        .yTickValues(yTicks);
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

if (window.intervalId) {
    window.clearInterval(window.intervalId);
}
window.intervalId = setInterval(renderChart, 200);
