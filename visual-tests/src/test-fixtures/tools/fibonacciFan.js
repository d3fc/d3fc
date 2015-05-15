(function(d3, fc) {
    'use strict';

    var form = document.forms['fan-form'];
    var data = fc.dataGenerator().startDate(new Date(2014, 1, 1))(50);

    var chart = d3.select('#fan'),
        chartLayout = fc.test.chartLayout();

    chart.call(chartLayout);

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
        .range([0, chartLayout.getPlotAreaWidth()])
        .nice();

    // Create scale for y axis
    var priceScale = d3.scale.linear()
        .domain([priceFrom, priceTo])
        .range([chartLayout.getPlotAreaHeight(), 0])
        .nice();

    // Create the axes
    var dateAxis = d3.svg.axis()
        .scale(dateScale)
        .orient('bottom')
        .ticks(5);

    var priceAxis = d3.svg.axis()
        .scale(priceScale)
        .orient('right')
        .ticks(5);

    // Add the axes to the chart
    chartLayout.getAxisContainer('bottom').call(dateAxis);
    chartLayout.getAxisContainer('right').call(priceAxis);

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

    // Add the primary bar series
    chartLayout.getPlotArea().append('g')
        .attr('class', 'series')
        .datum(data)
        .call(bar);

    // Create a fibonacciFan tool
    var fibonacciFan = fc.tools.fibonacciFan()
        .xScale(dateScale)
        .yScale(priceScale)
        .snap(fc.utilities.seriesPointSnap(bar, data))
        .decorate(function(selection) {
            selection.enter()
                .append('circle')
                .attr('r', 6)
                .style('stroke', 'black')
                .style('fill', 'none');
            selection.select('circle')
                .attr('cx', function(d) { return d.target ? dateScale(d.target.x) : 0; })
                .attr('cy', function(d) { return d.target ? priceScale(d.target.y) : 0; })
                .style('visibility', function(d) { return d.state !== 'DONE' ? 'visible' : 'hidden'; });
        })
        .on('fansource', function(d) {
            form.eventlog.value = 'fansource ' + d[0].source.x + ',' + d[0].source.y + '\n' + form.eventlog.value;
        })
        .on('fantarget', function(d) {
            form.eventlog.value = 'fantarget ' + d[0].target.x + ',' + d[0].target.y + '\n' + form.eventlog.value;
        })
        .on('fanclear', function() {
            form.eventlog.value = 'fanclear\n' + form.eventlog.value;
        });

    // Add it to the chart
    var container = chartLayout.getPlotArea()
        .append('g')
        .datum([])
        .attr('class', 'fan-container')
        .call(fibonacciFan);

    d3.select(form.clear)
        .on('click', function() {
            container.datum([])
                .call(fibonacciFan);
            d3.event.preventDefault();
        });

    d3.select(form.pointerevents)
        .on('click', function() {
            container.style('pointer-events', this.checked ? 'all' : 'none');
        });

    d3.select(form.display)
        .on('click', function() {
            container.style('display', this.checked ? '' : 'none');
        });

})(d3, fc);
