(function(d3, fc) {
    'use strict';

    var generator = fc.data.random.financial().startDate(new Date(2014, 1, 1));
    var data = generator(20);

    var width = 600, height = 250;

    var container = d3.select('#update')
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

    var ohlc = fc.series.ohlc()
        .xScale(dateScale)
        .yScale(priceScale);

    var bar = fc.series.bar()
        .yValue(function(d) { return d.low - 0.2; })
        .xScale(dateScale)
        .yScale(priceScale);

    var line = fc.series.line()
        .yValue(function(d) { return d.low - 0.2; })
        .xScale(dateScale)
        .yScale(priceScale);

    var candle = fc.series.candlestick()
        .xScale(dateScale)
        .yScale(priceScale);

    // add the components to the chart
    var ohlcContainer = container.append('g')
        .datum(data);

    var barContainer = container.append('g')
        .datum(data);

    var lineContainer = container.append('g')
        .datum(data);

    var candleContainer = container.append('g')
        .datum(data);


    function render() {
        ohlcContainer.call(ohlc);
        barContainer.call(bar);
        lineContainer.call(line);
        candleContainer.call(candle);
    }

    render();

    setInterval(function() {
        var datum;
        while (!datum) {
            datum = generator(1)[0];
        }
        data.push(datum);
        data.shift();
        data.forEach(function(d) {
            d.low = d.low - 0.1;
        });
        dateScale.domain(fc.util.extent().fields('date')(data));
        priceScale.domain(fc.util.extent().fields(['high', 'low'])(data));
        render();
    }, 1000);
})(d3, fc);
