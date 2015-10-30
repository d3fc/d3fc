(function(d3, fc) {
    'use strict';

    var data = fc.data.random.financial().startDate(new Date(2014, 1, 1))(50);

    var width = 600, height = 250;

    var container = d3.select('#envelope')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    // Create scale for x axis
    var dateScale = fc.scale.dateTime()
        .domain(fc.util.extent().fields('date')(data))
        .range([0, width])
        .nice();

    // Create scale for y axis
    var priceScale = d3.scale.linear()
        .domain(fc.util.extent().fields(['high', 'low'])(data))
        .range([height, 0])
        .nice();

    // Create the candlestick series
    var candlestick  = fc.series.candlestick ()
        .xScale(dateScale)
        .yScale(priceScale);

    // Create and apply the EMA
    var movingAverage = fc.indicator.algorithm.exponentialMovingAverage();
    movingAverage(data);

    // Create a line that renders the result
    var ema = fc.series.line()
        .yValue(function(d) { return d.exponentialMovingAverage; })
        .xScale(dateScale)
        .yScale(priceScale);

    // Add it to the container
    container.append('g')
        .datum(data)
        .call(ema);

    // Create and apply the envelopes algorithm to the exponential moving average
    var envelopeAlgorithm = fc.indicator.algorithm.envelope()
        .factor(0.01)
        .value(function(d) { return d.exponentialMovingAverage; });
    envelopeAlgorithm(data);

    // Create the renderer
    var envelope = fc.indicator.renderer.envelope()
        .xScale(dateScale)
        .yScale(priceScale);

    // Add it to the container
    container.append('g')
        .datum(data)
        .call(envelope);

    // Adding candlestick to the container
    container.append('g')
        .datum(data)
        .call(candlestick);
})(d3, fc);
