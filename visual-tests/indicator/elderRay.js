(function(d3, fc) {
    'use strict';

    var data = fc.data.random.financial().startDate(new Date(2014, 1, 1))(50);

    var width = 600, height = 250;

    var container = d3.select('#elderRay')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    // Create scale for x axis
    var dateScale = fc.scale.dateTime()
        .domain(fc.util.extent().fields(['date'])(data))
        .range([0, width]);

    // Create scale for y axis
    var priceScale = d3.scale.linear()
        .domain([-5, 5])
        .range([height, 0]);

    // Create the stochastic oscillator component
    var elderRayAlgorithm = fc.indicator.algorithm.elderRay();

    elderRayAlgorithm(data);

    var elderRay = fc.indicator.renderer.elderRay()
        .xScale(dateScale)
        .yScale(priceScale);

    // Add it to the chart
    container.append('g')
        .datum(data)
        .call(elderRay);

})(d3, fc);
