(function(d3, fc) {
    'use strict';

    var data = fc.data.random.financial().startDate(new Date(2014, 1, 1))(50);

    var width = 600, height = 250;

    var container = d3.select('#force')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    // Create scale for x axis
    var dateScale = fc.scale.dateTime()
        .domain(fc.util.extent().fields(['date'])(data))
        .range([0, width])
        .nice();

    var forceAlgorithm = fc.indicator.algorithm.forceIndex();
    forceAlgorithm(data);

    // Calculate the maximum absolute value of the index
    var absoluteMax = d3.max(data, function(d) { return Math.abs(d.force); });

    //Scailing the display using the maximum absolute value of the Index
    var yScale = d3.scale.linear()
        .domain([-absoluteMax, absoluteMax])
        .range([height, 0]).nice();

    // Create the renderer
    var force = fc.indicator.renderer.forceIndex()
        .xScale(dateScale)
        .yScale(yScale);

    // Add it to the container
    container.append('g')
        .datum(data)
        .call(force);

})(d3, fc);
