(function(d3, fc) {
    'use strict';

    var container = d3.select('#offset-bar');

    var color = d3.scale.category10();

    function renderChart(data) {

        data = data.slice(-10);

        var transpose = fc.data.transposeCsv()
            .xValueKey('State');

        var series = transpose(data);

        var chart = fc.chart.cartesianChart(
                d3.scale.ordinal(),
                d3.scale.linear())
            .xDomain(data.map(function(d) { return d.State; }))
            .yDomain(fc.util.extent(series, [function(d) { return 0; }, function(d) { return d.y; }]))
            .margin({right: 50, bottom: 50});

        var offsetBar = fc.series.offsetBar()
            .xValue(function(d) { return d.x; })
            .yValue(function(d) { return d.y; })
            .decorate(function(sel, data, index) {
                sel.select('path')
                    .style('fill', color(index));
            });


        chart.plotArea(offsetBar);

        container.datum(series)
            .call(chart);
    }

    d3.csv('stackedBarData.csv', function(error, data) {
        renderChart(data);
    });

})(d3, fc);
