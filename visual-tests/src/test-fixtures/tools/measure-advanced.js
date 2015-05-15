(function(d3, fc) {
    'use strict';

    var form = document.forms['measure-1-form'];
    var data = fc.dataGenerator().startDate(new Date(2014, 1, 1))(50);
    data.measure = [];

    var width = 600, height = 250;

    var container = d3.select('#measure-1')
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

    // Create a measure tool
    var measure = fc.tools.measure()
        .xScale(dateScale)
        .yScale(priceScale)
        .on('measuresource', function(d) {
            form.eventlog.value = 'measuresource ' + d[0].source.x + ',' + d[0].source.y + '\n' + form.eventlog.value;
        })
        .on('measuretarget', function(d) {
            form.eventlog.value = 'measuretarget ' + d[0].target.x + ',' + d[0].target.y + '\n' + form.eventlog.value;
        })
        .on('measureclear', function() {
            form.eventlog.value = 'measureclear\n' + form.eventlog.value;
        });

    // Add it to the chart
    var multi = fc.series.multi()
        .xScale(dateScale)
        .yScale(priceScale)
        .series([bar, measure])
        .mapping(function(data, series) {
            switch (series) {
                case bar:
                    return data;
                case measure:
                    return data.measure;
            }
        });

    function render() {
        container.datum(data)
            .call(multi);
    }
    render();

    d3.select(form.clear)
        .on('click', function() {
            data.measure = [];
            render();
            d3.event.preventDefault();
        });

    // Use selectAll so that the data is not propagated
    var measureContainer = container.selectAll('g.multi-outer:last-child > g.multi-inner');

    d3.select(form.pointerevents)
        .on('click', function() {
            measureContainer.style('pointer-events', this.checked ? 'all' : 'none');
        });

    d3.select(form.display)
        .on('click', function() {
            measureContainer.style('display', this.checked ? '' : 'none');
        });

})(d3, fc);
