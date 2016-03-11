var data = fc.data.random.financial()(50);

var chart = fc.chart.cartesian(
        fc.scale.dateTime(),
        d3.scale.linear())
    .margin({bottom: 30, right: 40})
    .xDomain(fc.util.extent().fields(['date'])(data))
    .yDomain(fc.util.extent().fields(['high', 'low'])(data));

var gridlines = fc.annotation.gridline();
var candlestick = fc.series.candlestick();

var multi = fc.series.multi()
    .series([gridlines, candlestick]);
chart.plotArea(multi);

d3.select('#chart')
    .datum(data)
    .call(chart);
