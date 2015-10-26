(function (d3, fc) {
    'use strict';

    var data = fc.data.random.financial().startDate(new Date(2014, 1, 1))(50);

    var width = 600, height = 250;

    var container = d3.select('#ohlc')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    // Create scale for x axis
    var dateScale = fc.scale.dateTime()
        .domain(fc.util.extent()(data, 'date'))
        .range([0, width])
        .nice();

    // Create scale for y axis
    var priceScale = d3.scale.linear()
        .domain(fc.util.extent()(data, ['high', 'low']))
        .range([height, 0])
        .nice();


    var ohlc = fc.series.ohlc()
        .xScale(dateScale)
        .yScale(priceScale);

    container.append('g')
        .datum(data)
        .call(ohlc);
})(d3, fc);
