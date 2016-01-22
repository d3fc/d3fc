d3.csv('https://d3fc.io/components/chart/nasa-temp-data.csv', function(error, data) {
    data.forEach(function(d) {
        d.MonthName = d3.time.format('%b')(new Date(d.Year, d.Month - 1, 1));
    });
    var temperatureSeries = d3.nest()
        .key(function(d) { return d.Year; })
        .entries(data);

    var stationLine = fc.series.line()
        .xValue(function(d) { return d.MonthName; })
        .yValue(function(d) { return d.Station; });

    var landOceanLine = fc.series.line()
        .xValue(function(d) { return d.MonthName; })
        .yValue(function(d) { return d['Land+Ocean']; });

    var multi = fc.series.multi()
        .series([landOceanLine, stationLine]);

    var xDomain = data.map(function(d) { return d.MonthName; });
    var yDomain = fc.util.extent().fields([function() { return 0; }, 'Station', 'Land+Ocean'])(data);

    var smallMultiples = fc.chart.smallMultiples(
            d3.scale.ordinal(),
            d3.scale.linear())
        .columns(5)
        .yOrient('left')
        .margin({left: 50, bottom: 30})
        .xTickValues(xDomain.filter(function(d, i) { return (i % 3) === 0; }))
        .plotArea(multi)
        .yDomain(yDomain)
        .xDomain(xDomain);

    d3.select('#temperature-multiples')
        .datum(temperatureSeries)
        .call(smallMultiples);
});
