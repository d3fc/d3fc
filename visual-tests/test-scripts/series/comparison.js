(function(d3, fc) {
    'use strict';

    var data = [1, 2, 3].map(function() {
        return fc.utilities.dataGenerator()
            .seedDate(new Date(2014, 1, 1))
            .generate(50);
    });

    var chartLayout = fc.utilities.chartLayout();
    var chartBuilder = fc.utilities.chartBuilder(chartLayout);

    d3.select('#comparison')
        .call(chartBuilder);

    // Create scale for x axis
    var dateScale = fc.scale.dateTime()
        .domain(fc.utilities.extent(data, 'date'))
        .nice();

    // Create scale for y axis
    var priceScale = fc.scale.linear()
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

    var percentageChange = fc.math.percentageChange()
        .inputValue(function(d) { return d.close; })
        .outputValue(function(d, value) { return (d.percentageChange = value); })
        .initialIndex(0);

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

})(d3, fc);
