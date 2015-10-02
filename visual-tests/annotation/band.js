(function(d3, fc) {
    'use strict';

    var data = fc.data.random.financial().startDate(new Date(2014, 1, 1))(50);

    var width = 600, height = 250;

    var container = d3.select('#band')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    // Create scale for x axis
    var dateScale = fc.scale.dateTime()
        .domain(fc.util.extent(data, 'date'))
        .range([100, width])
        .nice();

    // Create scale for y axis
    var priceScale = d3.scale.linear()
        .domain(fc.util.extent(data, ['high', 'low']))
        .range([height, 0])
        .nice();

    // Create the OHLC series
    var ohlc = fc.series.ohlc()
        .xScale(dateScale)
        .yScale(priceScale);

    // Add the primary OHLC series
    container.append('g')
        .datum(data)
        .call(ohlc);

    // Create the annotations
    var verticalBand = fc.annotation.band()
        .xScale(dateScale)
        .yScale(priceScale)
        .x0(function(d) { return d[0].date; })
        .x1(function(d) { return d[1].date; });

    container
        .append('g')
        .datum([[data[5], data[10]], [data[15], data[20]]])
        .call(verticalBand);


    var horizontalData = [data[10], data[20]];

    var horizontalBand = fc.annotation.band()
        .xScale(dateScale)
        .yScale(priceScale)
        .y0(function(d) { return d.high; })
        .y1(function(d) { return d.low; });

    container
        .append('g')
        .datum(horizontalData)
        .call(horizontalBand);

})(d3, fc);