/* global d3:false, fc:false, requestAnimationFrame:false */
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

}(d3, fc));

(function (d3, fc) {
    fc.mainChart = function() {

        var event = d3.dispatch('crosshair', 'zoom');

        var gridlines = fc.annotation.gridline()
            .yTicks(3);

        var candlestick = fc.series.candlestick();

        var tooltip = fc.tooltip();

        var crosshairs = fc.tool.crosshair()
            .decorate(tooltip)
            .on('trackingstart.link', event.crosshair)
            .on('trackingmove.link', event.crosshair)
            .on('trackingend.link', event.crosshair)
            .xLabel('')
            .yLabel('');

        var multi = fc.series.multi()
            .series([gridlines, candlestick, crosshairs])
            .mapping(function(series) {
                switch (series) {
                case crosshairs:
                    return this.crosshairs;
                default:
                    return this;
                }
            });

        var xScale = fc.scale.dateTime();

        var chart = fc.chart.cartesianChart(xScale)
            .margin({
                bottom: 20,
                right: 60
            })
            .xTicks(0)
            .yTicks(3)
            .plotArea(multi);

        function mainChart(selection) {

            selection.each(function(data) {

                crosshairs.snap(fc.util.seriesPointSnap(candlestick, data));

                chart.xDomain(data.dateDomain)
                    .yDomain(fc.util.extent(data, ['high', 'low']))
                    .yNice();

                var container = d3.select(this)
                    .call(chart);

                // Zoom goes nuts if you re-use an instance and also can't set
                // the scale on zoom until it's been initialised by chart.
                var zoom = d3.behavior.zoom()
                    .on('zoom', function() {
                        event.zoom.call(this, xScale.domain());
                    })
                    .x(xScale);

                container.call(zoom);
            });
        }

        d3.rebind(mainChart, event, 'on');

        return mainChart;
    };
}(d3, fc));

(function (d3, fc) {
    fc.volumeChart = function() {

        var event = d3.dispatch('crosshair');

        var chart = fc.chart.cartesianChart(fc.scale.dateTime())
            .margin({
                bottom: 20,
                right: 60
            })
            .yTicks(2);

        var gridlines = fc.annotation.gridline()
            .yTicks(2);

        var bar = fc.series.bar()
            .yValue(function(d) { return d.volume; });

        var crosshairs = fc.tool.crosshair()
            .xLabel('')
            .yLabel('')
            .on('trackingstart.link', event.crosshair)
            .on('trackingmove.link', event.crosshair)
            .on('trackingend.link', event.crosshair);

        var multi = fc.series.multi()
            .series([gridlines, bar, crosshairs])
            .mapping(function(series) {
                switch (series) {
                case crosshairs:
                    return this.crosshairs;
                default:
                    return this;
                }
            });

        chart.plotArea(multi);

        function volumeChart(selection) {

            selection.each(function(data) {

                chart.xDomain(data.dateDomain)
                    .yDomain(fc.util.extent(data, 'volume'))
                    .yNice();

                bar.y0Value(chart.yDomain()[0]);

                crosshairs.snap(fc.util.seriesPointSnap(bar, data));

                d3.select(this)
                    .call(chart);
            });
        }

        d3.rebind(volumeChart, event, 'on');

        return volumeChart;
    };
}(d3, fc));

(function (d3, fc) {
    fc.navigatorChart = function() {
        var event = d3.dispatch('brush');

        var chart = fc.chart.cartesianChart(fc.scale.dateTime())
            .margin({
                top: 10,
                bottom: 20,
                right: 60
            })
            .xTicks(3)
            .yTicks(0);

        var gridlines = fc.annotation.gridline()
            .xTicks(3)
            .yTicks(0);

        var line = fc.series.line();

        var area = fc.series.area();

        var brush = d3.svg.brush()
            .on('brush', function() {
                var domain = [brush.extent()[0][0], brush.extent()[1][0]];
                // Scales with a domain delta of 0 === NaN
                if (domain[0] - domain[1] !== 0) {
                    event.brush.call(this, domain);
                }
            });

        var multi = fc.series.multi()
            .series([gridlines, line, area, brush])
            .mapping(function(series) {
                // Need to set the extent AFTER the scales
                // are set AND their ranges defined
                if (series === brush) {
                    // Use chart.yDomain to include `nice` adjustments
                    brush.extent([
                        [this.dateDomain[0], chart.yDomain()[0]],
                        [this.dateDomain[1], chart.yDomain()[1]]
                    ]);
                }
                return this;
            })
            .decorate(function(sel) {
                var height = d3.select(sel.node().parentNode).layout('height');
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

        function navigatorChart(selection) {

            selection.each(function(data) {

                chart.xDomain(data.navigatorDateDomain)
                    .yDomain(data.navigatorYDomain)
                    .yNice();

                area.y0Value(chart.yDomain()[0]);

                d3.select(this)
                  .call(chart);
            });
        }

        d3.rebind(navigatorChart, event, 'on');

        return navigatorChart;
    };
}(d3, fc));

(function(d3, fc) {
    'use strict';

    var dataGenerator = fc.data.random.financial()
        .startDate(new Date(2014, 1, 1));

    var data = dataGenerator(250);

    // Enhance data with interactive state
    data.crosshairs = [];
    var maxDate = fc.util.extent(data, 'date')[1];
    var minDate = new Date(maxDate - 50 * 24 * 60 * 60 * 1000);
    data.dateDomain = [minDate, maxDate];
    data.navigatorDateDomain = fc.util.extent(data, 'date');
    data.navigatorYDomain = fc.util.extent(data, 'close');

    var mainChart = fc.mainChart()
        .on('crosshair', render)
        .on('zoom', function(domain) {
            data.dateDomain = domain;
            render();
        });

    var volumeChart = fc.volumeChart()
        .on('crosshair', render);

    var navigatorChart = fc.navigatorChart()
        .on('brush', function(domain) {
            data.dateDomain = domain;
            render();
        });

    var container = d3.select('#low-barrel')
        .datum(data)
        .layout();

    function renderInternal() {
        var data = container.datum();

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

        container.layoutSuspended(true);
    }

    var rafId = null;
    function render() {
        if (rafId == null) {
            rafId = requestAnimationFrame(function() {
                rafId = null;
                renderInternal();
            });
        }
    }

    renderInternal();

}(d3, fc));
