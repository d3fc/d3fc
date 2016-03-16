(function(d3, fc) {
    'use strict';

    var priceFormat = d3.format('.2f');
    var tooltip = fc.chart.tooltip()
        .items([
            ['open', function(d) { return priceFormat(d.datum.open); }],
            ['high', function(d) { return priceFormat(d.datum.high); }],
            ['low', function(d) { return priceFormat(d.datum.low); }],
            ['close', function(d) { return priceFormat(d.datum.close); }]
        ]);

    var data = {
        series: fc.data.random.financial().startDate(new Date(2014, 1, 1))(50),
        crosshair: []
    };

    var width = 600, height = 250;

    var svg = d3.select('#tooltip')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    // Create scale for x axis
    var dateScale = fc.scale.dateTime()
        .domain(fc.util.extent().fields(['date'])(data.series))
        .range([0, width])
        .nice();

    // Create scale for y axis
    var priceScale = d3.scale.linear()
        .domain(fc.util.extent().fields(['high', 'low'])(data.series))
        .range([height, 0])
        .nice();

    var candlestick = fc.series.candlestick();

    var rectLayout = fc.layout.label()
        .position([20, 20])
        .size([100, 70])
        .component(tooltip);

    var crosshair = fc.tool.crosshair()
        .snap(fc.util.seriesPointSnapXOnly(candlestick, data.series))
        .on('trackingmove', render)
        .on('trackingstart', render)
        .on('trackingend', render);

    var multi = fc.series.multi()
        .series([candlestick, rectLayout, crosshair])
        .xScale(dateScale)
        .yScale(priceScale)
        .mapping(function(series) {
            switch (series) {
            case candlestick:
                return this.series;
            case crosshair:
            case rectLayout:
                return this.crosshair;
            }
        });

    function render() {
        svg.datum(data)
            .call(multi);
    }
    render();

})(d3, fc);
