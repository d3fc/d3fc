(function(d3, fc) {
    'use strict';

    var data = fc.data.random.financial().startDate(new Date(2014, 1, 1))(50);
    data.crosshair = [];

    // throw in a null value to test crosshair data filtering
    data[10].close = null;

    var width = 600, height = 250;

    var container = d3.select('#crosshair')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    // Calculate the scale domain
    var day = 8.64e7, // One day in milliseconds
        dateFrom = new Date(d3.min(data, function(d) { return d.date; }).getTime() - day),
        dateTo = new Date(d3.max(data, function(d) { return d.date; }).getTime() + day),
        priceFrom = d3.min(data, function(d) { return d.low; }),
        priceTo = d3.max(data, function(d) { return d.high; });

    // Create scale for x axis
    var dateScale = fc.scale.dateTime()
        .domain([dateFrom, dateTo])
        .range([0, width])
        .nice();

    // Create scale for y axis
    var priceScale = d3.scale.linear()
        .domain([priceFrom, priceTo])
        .range([height, 0])
        .nice();

    var color = d3.scale.category10();

    // Create the bar series
    var bar = fc.series.bar()
        .xScale(dateScale)
        .yScale(priceScale)
        .xValue(function(d) { return d.date; })
        .yValue(function(d) { return d.close; })
        .decorate(function(sel) {
            sel.selectAll('path')
                .style('fill', function(d) { return color(d.date.getDay()); });
        })
        .barWidth(9);

    // Create a crosshair tool
    var crosshair = fc.tool.crosshair()
        .xScale(dateScale)
        .yScale(priceScale)
        .xLabel(function(d) { return d3.time.format('%a, %e %b')(d.datum.date); })
        .yLabel(function(d) { return d3.format('.2f')(d.datum.close); })
        .decorate(function(selection) {
            // colour the trackball to match the bar
            selection
                .select('.point')
                .style({
                    fill: function(d) { return color(d.datum.date.getDay()); },
                    stroke: '#333',
                    'stroke-opactiy': 0.8,
                    'fill-opacity': 0.6
                });
        });

    // Add it to the chart
    var multi = fc.series.multi()
        .xScale(dateScale)
        .yScale(priceScale)
        .series([bar, crosshair])
        .mapping(function(series) {
            switch (series) {
            case bar:
                return this;
            case crosshair:
                return this.crosshair;
            }
        });

    // Configure the crosshair snapping
    var snap = fc.util.seriesPointSnap(bar, data);

    // Observe interaction with the chart, map them through the snapping function and re-render
    var pointer = fc.behaviour.pointer()
        .on('point', function(points) {
            data.crosshair = points.map(snap);
            render();
        });

    function render() {
        container.datum(data)
            .call(multi)
            .call(pointer);
    }

    render();
})(d3, fc);
