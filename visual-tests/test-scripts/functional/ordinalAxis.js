(function(d3, fc) {
    'use strict';

    var data = [
        {name: 'Fred', age: 24},
        {name: 'Bob', age: 22},
        {name: 'Frank', age: 18},
        {name: 'Jim', age: 18},
        {name: 'Brian', age: 35}
    ];

    var chart = d3.select('#ordinal-axis'),
        chartLayout = fc.utilities.chartLayout();

    chart.call(chartLayout);

    // Create scale for x axis
    var xScale = d3.scale.ordinal()
        .domain(data.map(function(d) { return d.name; }))
        .rangePoints([0, chartLayout.getPlotAreaWidth()], 1);

    var yScale = fc.scale.linear()
        .domain([0, 40])
        .range([chartLayout.getPlotAreaHeight(), 0]);

    // Create the axes
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient('bottom');

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient('right');

    // Add the axes to the chart
    chartLayout.getAxisContainer('bottom').call(xAxis);
    chartLayout.getAxisContainer('right').call(yAxis);

    var bar = fc.series.bar()
        .xValue(function(d) { return d.name; })
        .yValue(function(d) { return d.age; })
        .xScale(xScale)
        .yScale(yScale);

    var line = fc.series.line()
        .xValue(function(d) { return d.name; })
        .yValue(function(d) { return d.age - 2.0; })
        .xScale(xScale)
        .yScale(yScale);

    chartLayout.getPlotArea().append('g')
        .datum(data)
        .call(bar);

    chartLayout.getPlotArea().append('g')
        .datum(data)
        .call(line);


})(d3, fc);
