(function(d3, fc) {
    'use strict';

    var container = d3.select('#comparison')
        .append('svg');

    function renderData(container, data) {
        container
            .datum(data)
            .call(chart);
    }

    var data = [
        fc.utilities.dataGenerator().startDate(new Date(2014, 1, 1))(50),
        fc.utilities.dataGenerator().startDate(new Date(2013, 12, 15))(50)
    ];

    var findIndex = function(data, item, field) {
        // Find insertion point for item in seriesData.
        var bisect = d3.bisector(
            function(d) {
                return d[field];
            }).left;
        return bisect(data, item);
    };
    var percentageChange = fc.math.percentageChange()
        .inputValue(function(d) { return d.close; })
        .outputValue(function(d, value) { d.percentageChange = value; });

    data.forEach(percentageChange);

    var chart = fc.charts.linearTimeSeries()
        .xDomain(fc.utilities.extent(data, 'date'))
        .xNice()
        .xTicks(5)
        .yDomain(fc.utilities.extent(data, ['percentageChange']))
        .yNice()
        .yTicks(5);


    var line = fc.series.line()
        .xValue(function(d) { return d.date; })
        .yValue(function(d) { return d.percentageChange; });

    var multi = fc.series.multi()
        .series([line, line])
        .mapping(function(data, series, i) {
            return data[i];
        });

    chart.plotArea(multi);

    renderData(container, data);

    // zoom stuff!
    function zoomed() {
        var comparisonData = [];
        data.forEach(function(d) {
            var leftIndex = findIndex(d, chart.xDomain()[0], 'date'),
                rightIndex = findIndex(d, chart.xDomain()[1], 'date');
            if (leftIndex !== 0) {
                leftIndex -= 1; // Try to base from the data point one before the LHS of the date axis.
            }
            percentageChange.baseIndex(leftIndex);
            comparisonData.push(d.slice(leftIndex, rightIndex + 1));
            return percentageChange(d);
        });
        chart.xDomain(fc.utilities.extent(comparisonData, ['percentageChange']))
            .xNice();
        renderData(container, data);
    }

    chart.zoom().x(chart.xScale()).on('zoom', zoomed).scaleExtent([0.5, 3]);

})(d3, fc);
