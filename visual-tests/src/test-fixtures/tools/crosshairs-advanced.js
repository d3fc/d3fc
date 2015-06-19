(function(d3, fc) {
    'use strict';

    var form = document.forms['crosshairs-1-form'];
    var data = fc.dataGenerator().startDate(new Date(2014, 1, 1))(50);
    data.crosshairs = [];

    var width = 600, height = 250;

    var container = d3.select('#crosshairs-1')
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
        .discontinuityProvider(fc.scale.discontinuity.skipWeekends())
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
        .yValue(function(d) { return d.close; })
        .decorate(function(sel) {
            sel.style('fill', function(d) { return color(d.date.getDay()); });
        })
        .barWidth(9);

    // Create a crosshairs tool
    var crosshairs = fc.tools.crosshairs()
        .xScale(dateScale)
        .yScale(priceScale)
        .on('trackingstart', function(d) {
            form.eventlog.value = 'trackingstart ' + d[0].x + ',' + d[0].y + '\n' + form.eventlog.value;
        })
        .on('trackingmove', function(d) {
            form.eventlog.value = 'trackingmove ' + d[0].x + ',' + d[0].y + '\n' + form.eventlog.value;
        })
        .on('trackingend', function() {
            form.eventlog.value = 'trackingend\n' + form.eventlog.value;
        });

    // Add it to the chart
    var multi = fc.series.multi()
        .xScale(dateScale)
        .yScale(priceScale)
        .series([bar, crosshairs])
        .mapping(function(series) {
            switch (series) {
                case bar:
                    return this;
                case crosshairs:
                    return this.crosshairs;
            }
        });

    function render() {
        container.datum(data)
            .call(multi);
    }
    render();

    d3.select(form.clear)
        .on('click', function() {
            data.crosshairs = [];
            render();
            d3.event.preventDefault();
        });

    // Use selectAll so that the data is not propagated
    var crosshairsContainer = container.selectAll('g.multi-outer:last-child > g.multi-inner');

    d3.select(form.pointerevents)
        .on('click', function() {
            crosshairsContainer.style('pointer-events', this.checked ? 'all' : 'none');
        });

    d3.select(form.display)
        .on('click', function() {
            crosshairsContainer.style('display', this.checked ? '' : 'none');
        });

})(d3, fc);
