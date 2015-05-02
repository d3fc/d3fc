(function(d3, fc) {
    'use strict';

    var data = [
        fc.dataGenerator().startDate(new Date(2014, 1, 1))(50),
        fc.dataGenerator().startDate(new Date(2013, 12, 15))(50)
    ];

    var chartLayout = fc.test.chartLayout();
    var chartBuilder = fc.test.chartBuilder(chartLayout);
    var zoom = d3.behavior.zoom();

    d3.select('#comparison')
        .call(chartBuilder);

    chartLayout.getChartArea().call(zoom);

    var findIndex = function(data, item, field) {
        // Find insertion point for item in seriesData.
        var bisect = d3.bisector(
            function(d) {
                return d[field];
            }).left;
        return bisect(data, item);
    };

    // Create scale for x axis
    var dateScale = fc.scale.dateTime()
        .domain(fc.utilities.extent(data, 'date'))
        .nice();

    // Create scale for y axis
    var priceScale = d3.scale.linear()
        .domain(fc.utilities.extent(data, ['high', 'low']))
        .nice();

    // Create the axes
    var dateAxis = d3.svg.axis()
        .scale(dateScale)
        .orient('bottom')
        .ticks(5);

    var priceAxis = d3.svg.axis()
        .scale(priceScale)
        .orient('left')
        .ticks(5);

    var percentageChange = fc.indicators.algorithms.percentageChange()
        .inputValue(function(d) { return d.close; })
        .outputValue(function(d, value) { d.percentageChange = value; });

    data.forEach(percentageChange);

    priceScale.domain(fc.utilities.extent(data, ['percentageChange']))
        .nice();

    var line = fc.series.line()
        .xScale(dateScale)
        .yScale(priceScale)
        .xValue(function(d) { return d.date; })
        .yValue(function(d) { return d.percentageChange; });

    // add the components to the chart
    chartBuilder.setAxis('bottom', dateAxis);
    chartBuilder.setAxis('left', priceAxis);
    chartBuilder.addToPlotArea([
        function(selection) {
            selection.each(function(data) {
                var container = d3.select(this);
                fc.utilities.simpleDataJoin(container, 'comparison-line', data)
                    .call(line);
            });
        }
    ]);

    // associate the data
    chartBuilder.setData(data);
    // draw stuff!
    chartBuilder.render();

    // zoom stuff!
    function zoomed() {
        var comparisonData = [];
        data.forEach(function(d) {
            var leftIndex = findIndex(d, dateScale.domain()[0], 'date'),
                rightIndex = findIndex(d, dateScale.domain()[1], 'date');
            if (leftIndex !== 0) {
                leftIndex -= 1; // Try to base from the data point one before the LHS of the date axis.
            }
            percentageChange.baseIndex(leftIndex);
            comparisonData.push(d.slice(leftIndex, rightIndex + 1));
            return percentageChange(d);
        });
        chartBuilder.setData(data);
        priceScale.domain(fc.utilities.extent(comparisonData, ['percentageChange'])).nice();
        chartBuilder.render();
    }

    zoom.x(dateScale).on('zoom', zoomed).scaleExtent([0.5, 3]);

})(d3, fc);
