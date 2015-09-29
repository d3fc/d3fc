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

    var renderOffsetBar = true;

    function renderChart(data, offset, order) {

        data = data.slice(-10);
        sortData(data);

        var transpose = transposeCsv()
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

        if (renderOffsetBar) {

            chart.yDomain(fc.util.extent(series, [function(d) { return 0; }, function(d) { return d.y; }]));

            var offsetBar = fc.series.stacked.offsetBar()
                .xValue(function(d) { return d.x; })
                .yValue(function(d) { return d.y; })
                .decorate(function(sel, data, index) {
                    sel.select('path')
                        .style('fill', color(index));
                });

            chart.plotArea(offsetBar);

        } else {

            var stackedBar = fc.series.stacked.bar()
                .xValue(function(d) { return d.x; })
                .decorate(function(sel, data, index) {
                    sel.select('path')
                        .style('fill', color(index));
                });

            chart.plotArea(stackedBar);
        }

        container.datum(series)
            .call(chart);
    }

    d3.csv('stackedBarData.csv', function(error, data) {
        function render() {
            renderChart(data, getSelectedOption('offset'), getSelectedOption('order'));
        }
        d3.select('#offset').on('change', render);
        d3.select('#order').on('change', render);
        render();
    });

    // the D3 CSV loader / parser converts each row into an object with property names
    // derived from the headings in the CSV. The transpose function converts this into an
    // array of series, one per 'heading'
    function transposeCsv() {

        var xValueKey = '',
            stacked = false,
            stackLayout = d3.layout.stack();

        var transpose = function(data) {
            var series = Object.keys(data[0])
                .filter(function(key) {
                    return key !== xValueKey;
                })
                .map(function(key) {
                    return {
                        name: key,
                        data: data.map(function(row) {
                            return {
                                x: row[xValueKey],
                                y: Number(row[key])
                            };
                        })
                    };
                });

            if (stacked) {
                series = stackLayout(series.map(function(d) { return d.data; }));
            }

            return series;
        };

        transpose.stacked = function(x) {
            if (!arguments.length) {
                return stacked;
            }
            stacked = x;
            return transpose;
        };

        transpose.xValueKey = function(x) {
            if (!arguments.length) {
                return xValueKey;
            }
            xValueKey = x;
            return transpose;
        };

        d3.rebind(transpose, stackLayout, 'order', 'offset', 'out');

        return transpose;
    }

})(d3, fc);
