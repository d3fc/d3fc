(function(d3, fc) {
    'use strict';

    var dataGenerator = fc.data.random.financial()
        .startDate(new Date(2014, 1, 1));
    var data = dataGenerator(50);

    // Calculate the scale domain
    var day = 8.64e7, // One day in milliseconds
        dateFrom = new Date(d3.min(data, function(d) { return d.date; }).getTime() - day),
        dateTo = new Date(d3.max(data, function(d) { return d.date; }).getTime() + day),
        priceFrom = d3.min(data, function(d) { return d.low; }),
        priceTo = d3.max(data, function(d) { return d.high; });

    var chart = fc.chart.linearTimeSeries()
        .xDomain([dateFrom, dateTo])
        .xNice()
        .xTicks(5)
        .yDomain([priceFrom, priceTo])
        .yNice()
        .yTicks(5);

    // Create the gridlines
    var gridlines = fc.annotation.gridline();

    // Create the line series
    var line = fc.series.line()
        .yValue(function(d) { return d.open; });

    // Create the area series
    var area = fc.series.area()
        .y0Value(function(d) { return d.low; })
        .y1Value(function(d) { return d.high; });

    // Create the point series
    var point = fc.series.point()
        .yValue(function(d) { return d.close; });

    // add a bollinger - which results in a nested mutli-series
    var bollingerComputer = fc.indicator.algorithm.bollingerBands();
    bollingerComputer(data);
    var bollingerRenderer = fc.indicator.renderer.bollingerBands();

    // Create the multi series
    var multi = fc.series.multi()
        .series([gridlines, bollingerRenderer, line, area, point]);
    chart.plotArea(multi);

    var svg = d3.select('#multi')
            .append('svg')
            .style({
                height: '240px',
                width: '320px'
            });

    function render() {
        svg.datum(data)
            .call(chart);
    }

    // issues with nested multi-series only manifest themselves when
    // the data-join is evaluated a second time, hence we render
    // twice in this test
    render();
    render();

})(d3, fc);
