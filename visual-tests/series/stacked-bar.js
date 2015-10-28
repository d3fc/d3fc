(function(d3, fc) {
    'use strict';

    var container = d3.select('#stacked-bar');

    function getSelectedOption(id) {
        var e = document.getElementById(id);
        return e.options[e.selectedIndex].value;
    }

    function sortData(data) {
        function total(row) {
            return d3.sum(Object.keys(row).filter(function(key) { return key !== 'State'; })
                .map(function(key) { return Number(row[key]); }));
        }
        data.sort(function(a, b) {
            return total(b) - total(a);
        });
    }

    function renderChart(data, offset, order, seriesType) {

        // see #574 - wiping out the chart each time to clear the plot-area
        container.html('');

        data = data.slice(-20);
        sortData(data);

        var spread = fc.data.spread()
            .xValueKey('State');
        var stack = d3.layout.stack()
            .values(function(d) { return d.values; })
            .offset(offset)
            .order(order);

        var series = stack(spread(data));
        series.seriesType = seriesType;

        var extent = fc.util.extent().include(0);
        var yDomain = extent.fields(function(d) { return d.y + d.y0; })(series.map(function(d) { return d.values; }));
        var xDomain = series[0].values.map(function(d) { return d.x; });

        var chart = fc.chart.cartesian(
                d3.scale.ordinal(),
                d3.scale.linear())
            .xDomain(xDomain)
            .yDomain(yDomain)
            .margin({right: 50, bottom: 50});

        var stackedBar = fc.series.stacked[seriesType]()
            .xValue(function(d) { return d.x; });

        var multi = fc.series.multi()
            .key(function(d) { return d.seriesType; })
            .series([stackedBar]);

        chart.plotArea(multi);

        container.datum(series)
            .call(chart);
    }

    d3.csv('stackedBarData.csv', function(error, data) {
        function render() {
            renderChart(data,
                getSelectedOption('offset'),
                getSelectedOption('order'),
                getSelectedOption('series'));
        }
        d3.selectAll('select').on('change', render);
        render();
    });

})(d3, fc);
