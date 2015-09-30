(function(d3, fc) {
    'use strict';

    var container = d3.select('#stacked-bar');

    var color = d3.scale.category10();

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

    // TODO: construct a transpose component
    // TODO: check which properties the stacked series expose.
    // TODO: refactor stack to use rebindAll
    // TODO: bar / column - default to x / y?

    function renderChart(data, offset, order, seriesType) {

        container.html('');

        data = data.slice(-20);
        sortData(data);

        var transpose = fc.data.transposeCsv()
            .xValueKey('State')
            .stacked(true)
            .offset(offset)
            .order(order);

        var series = transpose(data);

        var chart = fc.chart.cartesianChart(
                d3.scale.ordinal(),
                d3.scale.linear())
            .xDomain(data.map(function(d) { return d.State; }))
            .yDomain(fc.util.extent(series, [function(d) { return 0; }, function(d) { return d.y + d.y0; }]))
            .margin({left: 50, bottom: 50});

        var stackedBar = fc.series.stacked[seriesType]()
            .xValue(function(d) { return d.x; })
            .decorate(function(sel, data, index) {
                if (seriesType === 'bar') {
                    sel.select('path')
                        .style('fill', color(index));
                }
                if (seriesType === 'line') {
                    sel.style('stroke', color(index));
                }
                if (seriesType === 'area') {
                    sel.style('fill', color(index));
                }
            });

        chart.plotArea(stackedBar);

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
