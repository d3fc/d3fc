var data = fc.randomFinancial()(50);

var yExtent = fc.extentLinear()
  .accessors([
    function(d) { return d.high; },
    function(d) { return d.low; }
  ]);

var xExtent = fc.extentDate()
  .accessors([function(d) { return d.date; }]);

var gridlines = fc.annotationSvgGridline();
var candlestick = fc.seriesSvgCandlestick();
var multi = fc.seriesSvgMulti()
    .series([gridlines, candlestick]);

var chart = fc.chartSvgCartesian(
    fc.scaleDiscontinuous(d3.scaleTime()),
    d3.scaleLinear()
  )
  .yDomain(yExtent(data))
  .xDomain(xExtent(data))
  .plotArea(multi);

d3.select('#chart')
  .datum(data)
  .call(chart);
