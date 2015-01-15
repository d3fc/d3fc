(function(d3, fc) {
    'use strict';

    var form = document.forms['measure-1-form'];


    var data = fc.utilities.dataGenerator()
        .seedDate(new Date(2014, 1, 1))
        .randomSeed('12345')
        .generate(50);

    var chart = d3.select('#measure-1'),
        chartLayout = fc.utilities.chartLayout();

    chart.call(chartLayout);

    // Calculate the scale domain
    var day = 8.64e7, // One day in milliseconds
        dateFrom = new Date(d3.min(data, function(d) { return d.date; }).getTime() - day),
        dateTo = new Date(d3.max(data, function(d) { return d.date; }).getTime() + day),
        priceFrom = d3.min(data, function(d) { return d.low; }),
        priceTo = d3.max(data, function(d) { return d.high; });

    // Create scale for x axis
    var dateScale = fc.scale.dateTime()
        .alignPixels(true)
        .hideWeekends(true)
        .domain([dateFrom, dateTo])
        .range([0, chartLayout.getPlotAreaWidth()])
        .nice();

    // Create scale for y axis
    var priceScale = fc.scale.linear()
        .alignPixels(true)
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
        .yValue(fc.utilities.valueAccessor('close'))
        .decorate(function(sel) {
            sel.style('fill', function(d) { return color(d.date.getDay()); });
        })
        .barWidth(9);

    // Add the primary bar series
    chartLayout.getPlotArea().append('g')
        .attr('class', 'series')
        .datum(data)
        .call(bar);

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
    var container = chartLayout.getPlotArea()
        .append('g')
        .attr('class', 'measure-container')
        .on('click', function(d) {
            d.push(d[0]);
        })
        .call(measure);

    d3.select(form.clear)
        .on('click', function() {
            container.datum([])
                .call(measure);
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
