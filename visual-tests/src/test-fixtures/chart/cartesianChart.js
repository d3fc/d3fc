(function(d3, fc) {
    'use strict';

    // create a chart instance simply to grab the default values
    var config = fc.chart.cartesianChart();

    var chartConfig = [
        {label: 'y orient', value: 'right'},
        {label: 'x orient', value: 'bottom'},
        {label: 'y label', value: 'log(sin)'},
        {label: 'x label', value: 'value'},
        {label: 'chart label', value: config.chartLabel()},
        {label: 'chart margin', value: JSON.stringify(config.plotAreaMargin())},
        {label: 'x axis baseline', value: ''},
        {label: 'y axis baseline', value: ''}
    ];

    var chartContainer = d3.select('#chart');

    function render() {
        renderControls();
        renderChart();
    }

    function renderControls() {
        var container = d3.select('#controls');

        var yOrientationConfig = container.selectAll('tr')
            .data(chartConfig);

        var row = yOrientationConfig.enter()
            .append('tr');

        row.append('th')
            .append('span')
            .html(function(d) { return d.label; });

        row.append('td')
            .append('input')
            .attr({'type': 'text'})
            .on('blur', function(d) {
                d.value = this.value;
                render();
            });

        yOrientationConfig.select('input')
            .attr('value', function(d) { return d.value; });
    }

    function renderChart() {
        var data = d3.range(20).map(function(d) {
            return {
                x: d,
                y: (Math.sin(d) + 1.1)
            };
        });

        var chart = fc.chart.cartesianChart(
                d3.scale.linear(),
                d3.scale.linear())
            .xDomain(fc.util.extent(data, 'x'))
            .yDomain(fc.util.extent(data, 'y'))
            .yOrient(chartConfig[0].value)
            .xOrient(chartConfig[1].value)
            .yAxisLabel(chartConfig[2].value)
            .xAxisLabel(chartConfig[3].value)
            .chartLabel(chartConfig[4].value)
            .plotAreaMargin(JSON.parse(chartConfig[5].value));

        if (chartConfig[6].value) {
            chart.xBaseline(Number(chartConfig[6].value));
        }

        if (chartConfig[7].value) {
            chart.yBaseline(Number(chartConfig[7].value));
        }

        // Create the line and area series
        var line = fc.series.line()
            .xValue(function(d) { return d.x; })
            .yValue(function(d) { return d.y; });

        chart.plotArea(line);

        chartContainer.datum(data)
            .call(chart);
    }

    render();

})(d3, fc);
