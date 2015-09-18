(function(d3, fc) {
    'use strict';

    var chartConfig = [
        {label: 'y orient', value: 'right'},
        {label: 'x orient', value: 'bottom'},
        {label: 'y label', value: 'sin'},
        {label: 'x label', value: 'value'},
        {label: 'chart label', value: 'A sine wave'},
        {label: 'margin', value: JSON.stringify({bottom: 40, right: 40, top: 20})},
        {label: 'x axis baseline', value: ''},
        {label: 'y axis baseline', value: ''},
        {label: 'ordinal', value: false, type: 'checkbox'}
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
            .attr('type', function(d) { return d.type || 'text'; })
            .on('blur', function(d) {
                d.value = this.type === 'checkbox' ? this.checked : this.value;
                renderChart();
            })
            .on('click', function(d) {
                if (this.type === 'checkbox') {
                    d.value = this.checked;
                    renderChart();
                }
            });

        yOrientationConfig.select('input')
            .attr('value', function(d) { return d.value; });
    }

    function renderChart() {

        var data;

        var isOrdinal = chartConfig[8].value;

        if (isOrdinal) {
            data = [
                {name: 'bob', size: 45},
                {name: 'bill', size: 12},
                {name: 'frank', size: 33}
            ];
        } else {
            data = d3.range(20).map(function(d) {
                return {
                    x: d,
                    y: (Math.sin(d) + 1.1)
                };
            });
        }

        var chart = fc.chart.cartesianChart(
                isOrdinal ? d3.scale.ordinal() : d3.scale.linear(),
                d3.scale.linear())
            .xDomain(isOrdinal ? data.map(function(d) { return d.name; }) : fc.util.extent(data, 'x'))
            .yDomain(isOrdinal ? [0, 50] : fc.util.extent(data, 'y'))
            .yOrient(chartConfig[0].value)
            .xOrient(chartConfig[1].value)
            .yLabel(chartConfig[2].value)
            .xLabel(chartConfig[3].value)
            .chartLabel(chartConfig[4].value)
            .margin(JSON.parse(chartConfig[5].value));

        if (chartConfig[6].value) {
            chart.xBaseline(Number(chartConfig[6].value));
        }

        if (chartConfig[7].value) {
            chart.yBaseline(Number(chartConfig[7].value));
        }

        // Create the line and area series
        var bar = fc.series.bar()
            .xValue(function(d) { return isOrdinal ? d.name : d.x; })
            .yValue(function(d) { return isOrdinal ? d.size : d.y; });

        chart.plotArea(bar);

        chartContainer.datum(data)
            .call(chart);
    }

    render();

})(d3, fc);
