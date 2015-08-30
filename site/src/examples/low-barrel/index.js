
(function(d3, fc) {
    'use strict';

    // Assigning to fc is nasty but there's not a lot of choice I don't think...
    fc.tooltip = function() {

        var formatters = {
            date: d3.time.format('%A, %b %e, %Y'),
            price: d3.format('.2f'),
            volume: d3.format('0,5p')
        };

        function format(type, value) {
            return formatters[type](value);
        }

        var items = [
            function(d) { return format('date', d.date); },
            function(d) { return 'Open: ' + format('price', d.open); },
            function(d) { return 'High: ' + format('price', d.high); },
            function(d) { return 'Low: ' + format('price', d.low); },
            function(d) { return 'Close: ' + format('price', d.close); },
            function(d) { return 'Volume: ' + format('volume', d.volume); }
        ];

        var tooltip = function(selection) {

            var container = selection.enter()
                .append('g')
                .attr({
                    'class': 'info',
                    'transform': 'translate(5, 5)'
                });

            container.append('rect')
                .attr({
                    width: 130,
                    height: 76
                });

            container.append('text');

            container = selection.select('g.info');

            var tspan = container.select('text')
                .selectAll('tspan')
                .data(items);

            tspan.enter()
                .append('tspan')
                .attr('x', 4)
                .attr('dy', 12);

            tspan.text(function(d) {
                return d(container.datum().datum);
            });
        };

        return tooltip;
    };

})(d3, fc);

(function(d3, fc) {
    'use strict';

    var dataGenerator = fc.data.random.financial()
        .startDate(new Date(2014, 1, 1));

    var container = d3.select('#low-barrel')
        .datum(dataGenerator(250));

    function mainChart(selection) {

        var data = selection.datum();

        var gridlines = fc.annotation.gridline()
            .yTicks(3);

        var candlestick = fc.series.candlestick();

        var tooltip = fc.tooltip();

        var crosshairs = fc.tool.crosshair()
            .decorate(tooltip)
            .snap(fc.util.seriesPointSnap(candlestick, data))
            .on('trackingstart.link', render)
            .on('trackingmove.link', render)
            .on('trackingend.link', render)
            .xLabel('')
            .yLabel('');

        var multi = fc.series.multi()
            .series([gridlines, candlestick, crosshairs])
            .mapping(function(series) {
                switch (series) {
                    case crosshairs:
                        return data.crosshairs;
                    default:
                        return data;
                }
            });

        var chart = fc.chart.linearTimeSeries()
            .xDomain(data.dateDomain)
            .xTicks(0)
            .yDomain(fc.util.extent(data, ['high', 'low']))
            .yNice()
            .yTicks(3)
            .plotArea(multi);

        selection.call(chart);

        var zoom = d3.behavior.zoom()
            .x(chart.xScale())
            .on('zoom', function() {
                data.dateDomain[0] = chart.xDomain()[0];
                data.dateDomain[1] = chart.xDomain()[1];
                render();
            });

        selection.call(zoom);
    }

    function volumeChart(selection) {

        var data = selection.datum();

        var chart = fc.chart.linearTimeSeries()
            .xDomain(data.dateDomain)
            .yDomain(fc.util.extent(data, 'volume'))
            .yNice()
            .yTicks(2);

        var gridlines = fc.annotation.gridline()
            .yTicks(2);

        var bar = fc.series.bar()
            .yValue(function(d) { return d.volume; })
            .y0Value(chart.yDomain()[0]);

        var crosshairs = fc.tool.crosshair()
            .snap(fc.util.seriesPointSnap(bar, data))
            .xLabel('')
            .yLabel('')
            .on('trackingstart.link', render)
            .on('trackingmove.link', render)
            .on('trackingend.link', render);

        var multi = fc.series.multi()
            .series([gridlines, bar, crosshairs])
            .mapping(function(series) {
                switch (series) {
                    case crosshairs:
                        return data.crosshairs;
                    default:
                        return data;
                }
            });

        chart.plotArea(multi);

        selection.call(chart);
    }

    function navigatorChart(selection) {

        var data = selection.datum();

        var chart = fc.chart.linearTimeSeries()
            .xDomain(fc.util.extent(data, 'date'))
            .yDomain(fc.util.extent(data, 'close'))
            .yNice()
            .xTicks(3)
            .yTicks(0);

        var gridlines = fc.annotation.gridline()
            .xTicks(3)
            .yTicks(0);

        var line = fc.series.line();

        var area = fc.series.area()
            .y0Value(chart.yDomain()[0]);

        var brush = d3.svg.brush()
            .on('brush', function() {
                var domain = [brush.extent()[0][0], brush.extent()[1][0]];
                // Scales with a domain delta of 0 === NaN
                if (domain[0] - domain[1] !== 0) {
                    data.dateDomain = domain;
                    render();
                }
            });

        var multi = fc.series.multi()
            .series([gridlines, line, area, brush])
            .mapping(function(series) {
                // Need to set the extent AFTER the scales
                // are set AND their ranges defined
                if (series === brush) {
                    brush.extent([
                        [data.dateDomain[0], chart.yDomain()[0]],
                        [data.dateDomain[1], chart.yDomain()[1]]
                    ]);
                }
                return data;
            })
            .decorate(function(sel) {
                var height = Math.abs(chart.yScale().range()[0] - chart.yScale().range()[1]);
                sel.enter()
                    .selectAll('.resize.e>rect, .resize.w>rect')
                    .style('visibility', 'visible')
                    .attr('y', height / 4)
                    .attr('rx', 4)
                    .attr('ry', 4);

                // As a y scale is set on the brush (multi does this),
                // the brush component resets the height of the rect on every redraw,
                // as such it has to be overridden within the update selection,
                // rather than the enter selection
                sel.selectAll('.resize.e>rect, .resize.w>rect')
                    .attr('height', height / 2);
            });

        chart.plotArea(multi);

        selection.call(chart);
    }

    function render() {
        var data = container.datum();

        // Enhance data with interactive state
        if (data.crosshairs == null) {
            data.crosshairs = [];
        }
        if (data.dateDomain == null) {
            var maxDate = fc.util.extent(container.datum(), 'date')[1];
            var dateScale = d3.time.scale()
                .domain([maxDate - 50 * 24 * 60 * 60 * 1000, maxDate]);
            data.dateDomain = dateScale.domain();
        }

        // Calculate visible data for main/volume charts
        var bisector = d3.bisector(function(d) { return d.date; });
        var visibleData = data.slice(
            // Pad and clamp the bisector values to ensure extents can be calculated
            Math.max(0, bisector.left(data, data.dateDomain[0]) - 1),
            Math.min(bisector.right(data, data.dateDomain[1]) + 1, data.length)
        );
        visibleData.dateDomain = data.dateDomain;
        visibleData.crosshairs = data.crosshairs;

        container.select('svg.main')
            .datum(visibleData)
            .call(mainChart);

        container.select('svg.volume')
            .datum(visibleData)
            .call(volumeChart);

        container.select('svg.navigator')
            .call(navigatorChart);
    }

    render();

})(d3, fc);
