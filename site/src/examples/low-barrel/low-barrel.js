/* global d3:false, fc:false */
(function(d3, fc, example) {
    'use strict';

    var formatters = {
        date: d3.time.format('%A, %b %e, %Y'),
        price: d3.format('.2f'),
        volume: d3.format('0,5p')
    };

    example.candlestickSeries = function() {

        var base = fc.series.ohlcBase();

        var candlestick = fc.svg.candlestick()
            .x(function(d) { return d.x; })
            .open(function(d) { return d.yOpen; })
            .high(function(d) { return d.yHigh; })
            .low(function(d) { return d.yLow; })
            .close(function(d) { return d.yClose; });

        var nest = d3.nest()
            .key(function(d) { return d.direction; });

        var dataJoin = fc.util.dataJoin()
            .selector('path')
            .element('path');

        function candlestickSeries(selection) {
            selection.each(function(data) {
                data = data.filter(base.defined);

                candlestick.width(base.width(data));

                dataJoin(this, nest.entries(data.map(base.values)))
                    .attr({
                        'd': function(d) {
                            return candlestick(d.values);
                        },
                        'class': function(d) {
                            return 'candlestick ' + d.key;
                        }
                    });
            });
        }

        d3.rebind(candlestickSeries, base, 'xScale', 'yScale', 'xValue', 'yValue');

        return candlestickSeries;
    };

    example.mainChart = function() {

        var event = d3.dispatch('crosshair', 'zoom');

        var gridlines = fc.annotation.gridline()
            .yTicks(3);

        var candlestick = example.candlestickSeries();

        var tooltip = fc.chart.tooltip()
            .items([
                [function(d) { return formatters.date(d.datum.date); }, ''],
                ['High:', function(d) { return formatters.price(d.datum.high); }],
                ['Low:', function(d) { return formatters.price(d.datum.low); }],
                ['Open:', function(d) { return formatters.price(d.datum.open); }],
                ['Close:', function(d) { return formatters.price(d.datum.close); }],
                ['Volume:', function(d) { return formatters.volume(d.datum.volume); }]
            ]);

        var tooltipContainer = fc.tool.container()
            .padding(5)
            .component(tooltip);

        var tooltipLayout = fc.layout.label(fc.layout.strategy.boundingBox())
            .position([function(d) { return d.x; }, function(d) { return d.y; }])
            .size([150, 104])
            .component(tooltipContainer);

        var crosshairs = fc.tool.crosshair()
            .on('trackingstart.link', event.crosshair)
            .on('trackingmove.link', event.crosshair)
            .on('trackingend.link', event.crosshair)
            .xLabel('')
            .yLabel('');

        var multi = fc.series.multi()
            .series([gridlines, candlestick, tooltipLayout, crosshairs])
            .mapping(function(series) {
                switch (series) {
                case crosshairs:
                case tooltipLayout:
                    return this.crosshairs;
                default:
                    return this;
                }
            });

        var xScale = fc.scale.dateTime();

        var chart = fc.chart.cartesian(xScale)
            .margin({
                bottom: 20,
                right: 60
            })
            .xTicks(0)
            .yTicks(3)
            .plotArea(multi);

        function mainChart(selection) {

            selection.each(function(data) {

                crosshairs.snap(fc.util.seriesPointSnapXOnly(candlestick, data));

                chart.xDomain(data.dateDomain)
                    .yDomain(fc.util.extent().fields(['high', 'low'])(data))
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

    example.barSeries = function() {

        var base = fc.series.xyBase();

        var bar = fc.svg.bar()
            .verticalAlign('top')
            .x(base.x)
            .height(function(d) { return base.y(d) - base.y0(d); })
            .y(base.y0);

        var fractionalBarWidth = fc.util.fractionalBarWidth(0.75);

        var dataJoin = fc.util.dataJoin()
            .selector('path')
            .element('path');

        function barSeries(selection) {
            selection.each(function(data) {
                data = data.filter(base.defined);

                bar.width(fractionalBarWidth(data.map(base.x)));

                dataJoin(this, [data])
                    .attr({
                        'd': bar,
                        'class': 'bar'
                    });
            });
        }

        d3.rebind(barSeries, base, 'xScale', 'yScale', 'xValue', 'yValue', 'y0Value');

        return barSeries;
    };

    example.volumeChart = function() {

        var event = d3.dispatch('crosshair');

        var chart = fc.chart.cartesian(fc.scale.dateTime())
            .margin({
                bottom: 20,
                right: 60
            })
            .yTicks(2);

        var gridlines = fc.annotation.gridline()
            .yTicks(2);

        var bar = example.barSeries()
            .xValue(function(d) { return d.date; })
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
                    .yDomain(fc.util.extent().fields(['volume'])(data))
                    .yNice();

                bar.y0Value(chart.yDomain()[0]);

                crosshairs.snap(fc.util.seriesPointSnapXOnly(bar, data));

                d3.select(this)
                    .call(chart);
            });
        }

        d3.rebind(volumeChart, event, 'on');

        return volumeChart;
    };

    example.navigatorChart = function() {
        var event = d3.dispatch('brush');

        var chart = fc.chart.cartesian(fc.scale.dateTime())
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

        var area = fc.series.area()
            .xValue(function(d) { return d.date; })
            .yValue(function(d) { return d.close; })
            .decorate(function(sel) {
                sel.enter().style({fill: '#9cf'});
            });

        var line = fc.series.line()
            .xValue(function(d) { return d.date; })
            .yValue(function(d) { return d.close; })
            .decorate(function(sel) {
                sel.enter().style({stroke: '#06c'});
            });

        // the brush causes a partial render which can glitch things
        var brush = d3.svg.brush()
            .on('brush', function() {
                var domain = [brush.extent()[0][0], brush.extent()[1][0]];
                // Scales with a domain delta of 0 === NaN
                if (domain[0] - domain[1] !== 0) {
                    event.brush.call(this, domain);
                }
            });

        var multi = fc.series.multi()
            .series([gridlines, area, line, brush])
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

    example.lowBarrel = function() {
        var event = d3.dispatch('navigate', 'crosshair');

        var bisector = d3.bisector(function(d) { return d.date; });

        var mainChart = example.mainChart()
            .on('crosshair', event.crosshair)
            .on('zoom', event.navigate);

        var volumeChart = example.volumeChart()
            .on('crosshair', event.crosshair);

        var navigatorChart = example.navigatorChart()
            .on('brush', event.navigate);

        function lowBarrel(selection) {

            selection.each(function(data) {
                // Calculate visible data for main/volume charts
                var visibleData = data.slice(
                    // Pad and clamp the bisector values to ensure extents can be calculated
                    Math.max(0, bisector.left(data, data.dateDomain[0]) - 1),
                    Math.min(bisector.right(data, data.dateDomain[1]) + 1, data.length)
                );
                visibleData.dateDomain = data.dateDomain;
                visibleData.crosshairs = data.crosshairs;

                var container = d3.select(this);

                container.select('svg.main')
                    .datum(visibleData)
                    .call(mainChart);

                container.select('svg.volume')
                    .datum(visibleData)
                    .call(volumeChart);

                container.select('svg.navigator')
                    .datum(data)
                    .call(navigatorChart);
            });
        }

        d3.rebind(lowBarrel, event, 'on');

        return lowBarrel;
    };

    // Wrap in function to demonstrate no global access to state variables
    (function() {
        var data = fc.data.random.financial()
            .startDate(new Date(2014, 1, 1))(250);

        // Enhance data with interactive state
        data.crosshairs = [];
        var maxDate = fc.util.extent().fields(['date'])(data)[1];
        var minDate = new Date(maxDate - 50 * 24 * 60 * 60 * 1000);
        data.dateDomain = [minDate, maxDate];
        data.navigatorDateDomain = fc.util.extent().fields(['date'])(data);
        data.navigatorYDomain = fc.util.extent().fields(['close'])(data);

        var container = d3.select('#low-barrel')
            .layout();

        var render = fc.util.render(function() {
            container.datum(data)
                .call(lowBarrel);
        });

        var lowBarrel = example.lowBarrel()
            .on('crosshair', render)
            .on('navigate', function(domain) {
                data.dateDomain = [
                    new Date(Math.max(domain[0], data.navigatorDateDomain[0])),
                    new Date(Math.min(domain[1], data.navigatorDateDomain[1]))
                ];
                render();
            });

        render();
    }());

}(d3, fc, {}));
