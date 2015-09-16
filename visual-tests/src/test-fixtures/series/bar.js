(function(d3, fc) {
    'use strict';

    function renderColumnSeries() {
        var data = fc.data.random.financial().startDate(new Date(2014, 1, 1))
            .filter(d3.functor(true))
            (30);

        var width = 400, height = 250;

        var container = d3.select('#bar')
            .append('svg')
            .attr('width', width)
            .attr('height', height);

        // Create scale for x axis
        var dateScale = fc.scale.dateTime()
            .domain(fc.util.extent(data, 'date'))
            .range([0, width]);

        // offset the close price to give some negative values
        var extent = fc.util.extent(data, ['close']);
        var offset = extent[0] + (extent[1] - extent[0]) / 2;
        data.forEach(function(datum) {
            datum.close = datum.close - offset;
        });

        // Create scale for y axis
        var priceScale1 = d3.scale.linear()
            .domain(fc.util.extent(data, ['close']))
            .range([0, height / 2]);

        var bar1 = fc.series.bar()
            .y0Value((extent[1] - extent[0]) / 3)
            .xScale(dateScale)
            .yScale(priceScale1);

        // Add it to the chart
        container.append('g')
            .datum(data)
            .call(bar1);

        // Create scale for y axis
        var priceScale2 = d3.scale.linear()
            .domain(fc.util.extent(data, ['close']))
            .range([height / 2, height]);

        var bar2 = fc.series.bar()
            .xScale(dateScale)
            .yScale(priceScale2);

        // Add it to the chart
        container.append('g')
            .datum(data)
            .call(bar2);
    }

    function renderBarSeries() {
        var data = fc.data.random.financial().startDate(new Date(2014, 1, 1))
            .filter(d3.functor(true))
            (15);

        // offset the close price to give some negative values
        var extent = fc.util.extent(data, ['close']);
        var offset = extent[0] + (extent[1] - extent[0]) / 2;
        data.forEach(function(datum) {
            datum.close = datum.close - offset;
        });

        var width = 250, height = 250;

        var container = d3.select('#bar')
            .append('svg')
            .attr('width', width)
            .attr('height', height);

        // Create scale for y axis
        var dateScale = fc.scale.dateTime()
            .domain(fc.util.extent(data, 'date'))
            .range([0, height]);

        // Create scale for x axis
        var priceScale = d3.scale.linear()
            .domain(fc.util.extent(data, ['close']))
            .range([0, width]);

        var bar = fc.series.bar()
            .orient('horizontal')
            .xScale(priceScale)
            .yScale(dateScale);

        // Add it to the chart
        container.append('g')
            .datum(data)
            .call(bar);
    }

    renderBarSeries();
    renderColumnSeries();

})(d3, fc);
