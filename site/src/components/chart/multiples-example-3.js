d3.csv('./stocks.csv', type, function(error, data) {
  var symbols = d3.nest()
        .key(function(d) { return d.symbol; })
        .entries(data);

  var priceExtent = fc.util.extent()
        .fields(['price'])
        .pad([0, 0.5])
        .include([0]);

  symbols.forEach(function(symbol) {
    var minPrice = d3.max([priceExtent(symbol.values)[0], 0]);

    symbol.values.forEach(function(value) {
      value.minPrice = minPrice;
    });
  });

  var line = fc.series.line()
        .xValue(function(d) { return d.date; })
        .yValue(function(d) { return d.price; });

  var area = fc.series.area()
        .xValue(function(d) { return d.date; })
        .y0Value(function(d) { return d.minPrice; })
        .y1Value(function(d) { return d.price; });

  var multi = fc.series.multi()
        .series([area, line]);

  var xExtent = fc.util.extent()
        .fields(['date']);
  var xDomain = xExtent(symbols.map(function(_d) { return _d.values; }));

  var smallMultiples = fc.chart.smallMultiples(
            fc.scale.dateTime(),
            d3.scale.linear())
        .columns(1)
        .yOrient('right')
        .margin({left: 20, right: 50, bottom: 30})
        .plotArea(multi)
        .xDomain(xDomain)
        .yDomain(function(row) {
          return priceExtent(row.map(function(d) { return d.values; }));
        });

  d3.select('#multiples-varying-y-domain')
        .datum(symbols)
        .call(smallMultiples);
});

function type(d) {
  d.price = +d.price;
  d.date = d3.time.format('%b %Y').parse(d.date);
  return d;
}
