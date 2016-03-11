(function(d3, fc) {
    'use strict';

    var data = fc.data.random.financial().startDate(new Date(2014, 1, 1))(50);

    var width = 600, height = 250;

    var container = d3.select('#errorBar')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    // Create scale for x axis
    var dateScale = fc.scale.dateTime()
        .domain(fc.util.extent().fields(['date'])(data))
        .range([0, width])
        .nice();

    // Create scale for y axis
    var priceScale = d3.scale.linear()
        .domain(fc.util.extent().fields(['high', 'low'])(data))
        .range([height, 0])
        .nice();

    var errorBarV = fc.series.errorBar()
        .low(function(d, i) {
            return d.low;
        })
        .high(function(d, i) {
            return d.high;
        })
        .value(function(d, i) {
            return d.date;
        });

    var errorBarH = fc.series.errorBar()
        .orient('horizontal')
        .barWidth(3)
        .high(function(d, i) {
            return d3.time.hour.offset(d.date, 12);
        })
        .low(function(d, i) {
            return d3.time.hour.offset(d.date, -12);
        })
        .value(function(d, i) {
            return d.close;
        });

    var multi = fc.series.multi()
        .series([errorBarV, errorBarH])
        .xScale(dateScale)
        .yScale(priceScale);

    container.append('g')
        .datum(data)
        .call(multi);
})(d3, fc);
