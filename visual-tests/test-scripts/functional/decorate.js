(function(d3, fc) {
    'use strict';

    var generator = fc.utilities.dataGenerator()
        .seedDate(new Date(2014, 1, 1));
    var data = generator.generate(10);

    var chartLayout = fc.utilities.chartLayout();
    var chartBuilder = fc.utilities.chartBuilder(chartLayout);

    d3.select('#decorate')
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

    var color = d3.scale.ordinal()
        .range(['#98abc5', '#8a89a6', '#7b6888', '#6b486b', '#a05d56']);

    var bar = fc.series.bar()
        .decorate(function(sel) {
            sel.attr('fill', function(d, i) { return color(i); });
        })
        .xScale(dateScale)
        .yScale(priceScale);

    // add the components to the chart
    chartBuilder.setAxis('bottom', dateAxis);
    chartBuilder.setAxis('left', priceAxis);
    chartBuilder.addToPlotArea([bar]);

    chartBuilder.setData(data);

    chartBuilder.render();


})(d3, fc);
