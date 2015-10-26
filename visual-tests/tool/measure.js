(function (d3, fc) {
    'use strict';

    var data = fc.data.random.financial().startDate(new Date(2014, 1, 1))(50);
    data.measure = [];

    var width = 600, height = 250;

    var container = d3.select('#measure')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    // Calculate the scale domain
    var day = 8.64e7, // One day in milliseconds
        dateFrom = new Date(d3.min(data, function (d) { return d.date; }).getTime() - day),
        dateTo = new Date(d3.max(data, function (d) { return d.date; }).getTime() + day),
        priceFrom = d3.min(data, function (d) { return d.low; }),
        priceTo = d3.max(data, function (d) { return d.high; });

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
        .yValue(function (d) { return d.close; })
        .decorate(function (sel) {
            sel.selectAll('path')
                .style('fill', function (d) { return color(d.date.getDay()); });
        })
        .barWidth(9);

    // Create a measure tool
    var measure = fc.tool.measure()
        .xScale(dateScale)
        .yScale(priceScale)
        .snap(fc.util.seriesPointSnap(bar, data))
        .padding(10)
        .xLabel(function (d) {
            return !(d.source && d.target) ? '' :
            d3.time.day.range(d.source.datum.date, d.target.datum.date).length + ' days';
        })
        .yLabel(function (d) {
            return !(d.source && d.target) ? '' :
                d3.format('.2f')(d.target.datum.close - d.source.datum.close);
        })
        .decorate(function (selection) {
            selection.enter()
                .append('circle')
                .attr('r', 6)
                .style('stroke', 'black')
                .style('fill', 'none');
            selection.select('circle')
                .attr('cx', function (d) { return d.target ? dateScale(d.target.x) : 0; })
                .attr('cy', function (d) { return d.target ? priceScale(d.target.y) : 0; })
                .style('visibility', function (d) { return d.state !== 'DONE' ? 'visible' : 'hidden'; });
        });

    // Add it to the chart
    var multi = fc.series.multi()
        .xScale(dateScale)
        .yScale(priceScale)
        .series([bar, measure])
        .mapping(function (series) {
            switch (series) {
            case bar:
                return this;
            case measure:
                return this.measure;
            }
        });

    container.datum(data)
        .call(multi);

})(d3, fc);
