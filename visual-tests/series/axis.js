(function (d3, fc) {
    'use strict';

    var width = 400, height = 400;

    var container = d3.select('#axis')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    var data = [];
    for (var i = 0; i <= 100; i++) {
        var theta = (2 * Math.PI * i / 100) - Math.PI;
        data.push({
            theta: theta,
            sin: Math.sin(theta),
            cos: Math.cos(theta)
        });
    }

    var xScale = d3.scale.linear()
        .domain(fc.util.extent()(data, 'theta'))
        .range([0, width]);

    var yScale = d3.scale.linear()
        .domain(fc.util.extent()(data, 'sin', 'cos'))
        .range([height, 0])
        .nice();

    var xAxis = fc.series.axis()
        .orient('bottom');

    var yAxis = fc.series.axis()
        .orient('left');

    var sinLine = fc.series.line()
        .xValue(function (d) { return d.theta; })
        .yValue(function (d) { return d.sin; });

    var cosLine = fc.series.line()
        .xValue(function (d) { return d.theta; })
        .yValue(function (d) { return d.cos; });

    var multi = fc.series.multi()
        .series([xAxis, yAxis, sinLine, cosLine])
        .xScale(xScale)
        .yScale(yScale);

    container.datum(data)
        .call(multi);

})(d3, fc);
