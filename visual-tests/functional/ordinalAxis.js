(function (d3, fc) {
    'use strict';

    var data = [
        {name: 'Fred', age: 24},
        {name: 'Bob', age: 22},
        {name: 'Frank', age: 18},
        {name: 'Jim', age: 18},
        {name: 'Brian', age: 35}
    ];

    var width = 600, height = 250, axisHeight = 25;

    var chart = d3.select('#ordinal-axis')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    var axisContainer = chart.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(0, ' + (height - axisHeight) + ')');

    // Create scale for x axis
    var xScale = d3.scale.ordinal()
        .domain(data.map(function (d) { return d.name; }))
        .rangePoints([0, width], 1);

    var yScale = d3.scale.linear()
        .domain([0, 40])
        .range([height - axisHeight, 0]);

    // Create the axes
    var xAxis = fc.svg.axis()
        .scale(xScale)
        .orient('bottom');

    // Add the axes to the chart
    axisContainer.call(xAxis);

    var bar = fc.series.bar()
        .xValue(function (d) { return d.name; })
        .yValue(function (d) { return d.age; })
        .xScale(xScale)
        .yScale(yScale);

    var line = fc.series.line()
        .xValue(function (d) { return d.name; })
        .yValue(function (d) { return d.age - 2.0; })
        .xScale(xScale)
        .yScale(yScale);

    chart.append('g')
        .datum(data)
        .call(bar);

    chart.append('g')
        .datum(data)
        .call(line);


})(d3, fc);
