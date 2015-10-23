(function(d3, fc) {
    'use strict';

    var container = d3.select('#grouped-bar');

    var color = d3.scale.category10();

    function renderChart(data) {

        // see #574 - wiping out the chart each time to clear the plot-area
        container.html('');

        data = data.slice(-10);

        var spread = fc.data.spread()
            .xValueKey('State');

        var series = spread(data);

        var yDomain = fc.util.extent(series.map(function(d) { return d.values; }), function(d) { return 0; }, 'y');
        var xDomain = series[0].values.map(function(d) { return d.x; });

        var chart = fc.chart.cartesian(
                d3.scale.ordinal(),
                d3.scale.linear())
            .xDomain(xDomain)
            .yDomain(yDomain)
            .margin({right: 50, bottom: 50});

        var groupedBar = fc.series.groupedBar()
            .xValue(function(d) { return d.x; })
            .yValue(function(d) { return d.y; })
            .decorate(function(sel, data, index) {
                sel.select('path')
                    .style('fill', color(index));
            });

        chart.plotArea(groupedBar);

        container.datum(series)
            .call(chart);
    }

    d3.csv('stackedBarData.csv', function(error, data) {
        renderChart(data);
    });

})(d3, fc);
