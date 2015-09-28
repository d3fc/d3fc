(function(d3, fc) {
    'use strict';

    var container = d3.select('#stacked-bar');

    var color = d3.scale.category10();

    function renderChart(data, offset, yDomain) {

        var transpose = transposeCsv()
            .xValueKey('State')
            .stack(offset);

        var series = transpose(data);

        // Collect the X values.
        var xCategories = data.map(function(d) { return d.State; });

        var chart = fc.chart.cartesianChart(
                d3.scale.ordinal(),
                d3.scale.linear())
            .xDomain(xCategories)
            .yDomain(fc.util.extent(series, ['y', 'y0']))
            .margin(50);

        var stackedBar = fc.series.stacked.bar()
            .xValue(function(d) { return d.x; })
            .decorate(function(sel, data, index) {
                sel.select('path')
                    .style('fill', color(index));
            });

        chart.plotArea(stackedBar);

        container.datum(series)
            .call(chart);
    }

    var csvData;
    d3.csv('stackedBarData.csv', function(error, data) {
        csvData = data;


        var zeroRadio = document.getElementById('zero');
        zeroRadio.addEventListener('click', renderChart.bind(null, csvData, 'zero', [0, 40000000]));
        zeroRadio.setAttribute('checked', true);

        document.getElementById('expand')
            .addEventListener('click', renderChart.bind(null, csvData, 'expand', [0, 1]));

        renderChart(data, 'zero', [0, 40000000]);
    });

    // the D3 CSV loader / parser converts each row into an object with property names
    // derived from the headings in the CSV. The transpose function converts this into an
    // array of series, one per 'heading'
    function transposeCsv() {

        var xValueKey = '';

        var stack = 'none';

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

            if (stack !== 'none') {
                var stackLayout = d3.layout.stack()
                    .offset(stack);

                series = stackLayout(series.map(function(d) { return d.data; }));
            }

            return series;
        };

        transpose.stack = function(x) {
            if (!arguments.length) {
                return stack;
            }
            stack = x;
            return transpose;
        };

        transpose.xValueKey = function(x) {
            if (!arguments.length) {
                return xValueKey;
            }
            xValueKey = x;
            return transpose;
        };

        return transpose;
    }

})(d3, fc);
