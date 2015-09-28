(function(d3, fc) {
    'use strict';

    var width = 600, height = 250;

    var container = d3.select('#stacked-bar')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    function renderChart(data, offset, yDomain) {

        var transpose = transposeCsv()
            .xValue('State');

        var series = transpose(data);

        var stackLayout = d3.layout.stack()
            .offset(offset)
            .x(function(d) { return d.state; })
            .y(function(d) { return d.value; });

        var stackedData = stackLayout(series.map(function(d) { return d.data; }));
        stackedData.crosshair = [];

        // Collect the X values.
        var xCategories = data.map(function(d) { return d.State; });

        // create scales
        var x = d3.scale.ordinal()
            .domain(xCategories)
            .rangePoints([0, width], 1);

        var color = d3.scale.category10();

        var y = d3.scale.linear()
          .domain(yDomain)
          .nice()
          .range([height, 0]);

        var stackedBar = fc.series.stacked.bar()
            .xScale(x)
            .yScale(y)
            .xValue(function(d) { return d.state; })
            .decorate(function(sel, data, index) {
                sel.select('path')
                    .style('fill', color(index));
            });

        container.datum(stackedData)
            .call(stackedBar);
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

        var xValue;

        var transpose = function(data) {
            return Object.keys(data[0])
                .filter(function(key) {
                    return key !== xValue;
                })
                .map(function(key) {
                    return {
                        name: key,
                        data: data.map(function(row) {
                            return {
                                state: row[xValue],
                                value: Number(row[key])
                            };
                        })
                    };
                });
        };

        transpose.xValue = function(x) {
            if (!arguments.length) {
                return xValue;
            }
            xValue = x;
            return transpose;
        };

        return transpose;
    }

})(d3, fc);
