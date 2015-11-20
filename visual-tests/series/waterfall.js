(function(d3, fc) {
    'use strict';

    function renderColumnSeries() {
        var data = fc.data.random.financial().startDate(new Date(2014, 1, 1))
            .filter(d3.functor(true))
            (30);

        var width = 400, height = 250;

        var container = d3.select('#waterfall')
            .append('svg')
            .attr('width', width)
            .attr('height', height);

        // Create scale for x axis
        var dateScale = fc.scale.dateTime()
            .domain(fc.util.extent().fields('date')(data))
            .range([0, width]);

        // offset the close price to give some negative values
        var extent = fc.util.extent().fields('close')(data);
        var offset = extent[0] + (extent[1] - extent[0]) / 2;
        data.forEach(function(datum) {
            datum.close = datum.close - offset;
        });

        // Create scale for y axis
        var priceScale = d3.scale.linear()
            .domain(fc.util.extent().fields('close')(data))
            .range([height / 6, 5 * height / 6]);

        var waterfall = fc.series.waterfall()
            .y0Value((extent[1] - extent[0]) / 3)
            .xScale(dateScale)
            .yScale(priceScale);

        // Add it to the chart
        container.append('g')
            .datum(data)
            .call(waterfall);
    }

    function renderBarSeries() {
        var data = fc.data.random.financial().startDate(new Date(2014, 1, 1))
            .filter(d3.functor(true))
            (15);

        // offset the low price to give some negative values
        var extent = fc.util.extent().fields('low')(data);
        var offset = extent[0] + (extent[1] - extent[0]) / 2;
        data.forEach(function(datum) {
            datum.low = datum.low - offset;
        });

        var width = 250, height = 250;

        var container = d3.select('#waterfall')
            .append('svg')
            .attr('width', width)
            .attr('height', height);

        // Create scale for y axis
        var dateScale = fc.scale.dateTime()
            .domain(fc.util.extent().fields('date')(data))
            .range([0, height]);

        // Create scale for x axis
        var priceScale = d3.scale.linear()
            .domain(fc.util.extent().fields('low')(data))
            .range([0, width]);

        var waterfall = fc.series.waterfall()
            .orient('horizontal')
            .xValue(function(d) { return d.low; })
            .xScale(priceScale)
            .yScale(dateScale);

        // Add it to the chart
        container.append('g')
            .datum(data)
            .call(waterfall);
    }

    renderBarSeries();
    renderColumnSeries();

})(d3, fc);
