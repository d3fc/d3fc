(function (d3, fc) {
    'use strict';

    var width = 600, height = 250;

    var container = d3.select('#fc-time-fc-linear-hide-weekend')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(0,' + (height / 2) + ')');

    // Create scale for x axis
    var dateScale = fc.scale.dateTime()
        .discontinuityProvider(fc.scale.discontinuity.skipWeekends())
        .domain([new Date('Fri May 08 2015'), new Date('Fri May 22 2015')])
        .range([0, width]);

    // Create the axes
    var dateAxis = fc.svg.axis()
        .scale(dateScale)
        .orient('bottom')
        .ticks(10);

    container.call(dateAxis);

})(d3, fc);
