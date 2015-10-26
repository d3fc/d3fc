(function (d3, fc) {
    'use strict';

    var form = document.forms['fan-form'];
    var data = fc.data.random.financial().startDate(new Date(2014, 1, 1))(50);
    data.fibonacciFan = [];

    var width = 600, height = 250;

    var container = d3.select('#fan')
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

    // Create a fibonacciFan tool
    var fibonacciFan = fc.tool.fibonacciFan()
        .xScale(dateScale)
        .yScale(priceScale)
        .snap(fc.util.seriesPointSnap(bar, data))
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
        })
        .on('fansource', function (d) {
            form.eventlog.value = 'fansource ' + d[0].source.x + ',' + d[0].source.y + '\n' + form.eventlog.value;
        })
        .on('fantarget', function (d) {
            form.eventlog.value = 'fantarget ' + d[0].target.x + ',' + d[0].target.y + '\n' + form.eventlog.value;
        })
        .on('fanclear', function () {
            form.eventlog.value = 'fanclear\n' + form.eventlog.value;
        });


    // Add it to the chart
    var multi = fc.series.multi()
        .xScale(dateScale)
        .yScale(priceScale)
        .series([bar, fibonacciFan])
        .mapping(function (series) {
            switch (series) {
            case bar:
                return this;
            case fibonacciFan:
                return this.fibonacciFan;
            }
        });

    function render() {
        container.datum(data)
            .call(multi);
    }
    render();

    d3.select(form.clear)
        .on('click', function () {
            data.fan = [];
            render();
            d3.event.preventDefault();
        });
    // Use selectAll so that the data is not propagated
    var fanContainer = container.selectAll('g.multi-outer:last-child > g.multi-inner');

    d3.select(form.pointerevents)
        .on('click', function () {
            fanContainer.style('pointer-events', this.checked ? 'all' : 'none');
        });

    d3.select(form.display)
        .on('click', function () {
            fanContainer.style('display', this.checked ? '' : 'none');
        });

})(d3, fc);
