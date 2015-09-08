(function(d3, fc) {
    'use strict';

    // create a chart instance simply to grab the default values
    var config = fc.chart.cartesianChart();

    var chartConfig = [
        {label: 'y orient', value: 'right'},
        {label: 'y label', value: 'log(sin)'},
        {label: 'x label', value: 'value'},
        {label: 'x axis label height', value: config.xAxisLabelHeight()},
        {label: 'y axis label width', value: config.yAxisLabelWidth()},
        {label: 'x axis height', value: config.xAxisHeight()},
        {label: 'y axis width', value: config.yAxisWidth()},
        {label: 'chart label', value: config.chartLabel()},
        {label: 'chart label height', value: config.chartLabelHeight()}
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
                y: (Math.sin(d) + 1.1) * 10000
            };
        });

        var chart = fc.chart.cartesianChart(
                d3.scale.linear(),
                d3.scale.log())
            .xDomain(fc.util.extent(data, 'x'))
            .yDomain(fc.util.extent(data, 'y'))
            .yOrient(chartConfig[0].value)
            .yAxisLabel(chartConfig[1].value)
            .xAxisLabel(chartConfig[2].value)
            .xAxisLabelHeight(Number(chartConfig[3].value))
            .yAxisLabelWidth(Number(chartConfig[4].value))
            .xAxisHeight(Number(chartConfig[5].value))
            .yAxisWidth(Number(chartConfig[6].value))
            .chartLabel(chartConfig[7].value)
            .chartLabelHeight(Number(chartConfig[8].value));

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
