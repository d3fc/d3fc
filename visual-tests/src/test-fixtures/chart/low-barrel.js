(function(d3, fc) {
    'use strict';

    var dataGenerator = fc.utilities.dataGenerator()
        .startDate(new Date(2014, 1, 1));

    var container = d3.select('#low-barrel')
        .datum(dataGenerator(250));

    function mainChart(selection) {

        var data = selection.datum();

        var gridlines = fc.scale.gridlines()
            .yTicks(3);

        var candlestick = fc.series.candlestick();

        var crosshairs = fc.tools.crosshairs()
            .decorate(fc.tooltip())
            .snap(fc.utilities.seriesPointSnap(candlestick, data))
            .on('trackingmove.link', render);

        var multi = fc.series.multi()
            .series([gridlines, candlestick, crosshairs])
            .mapping(function(data, series) {
                switch (series) {
                    case crosshairs:
                        return data.crosshairs;
                    default:
                        return data;
                }
            });

        var chart = fc.charts.linearTimeSeries()
            .xDomain(data.dateDomain)
            .xTicks(0)
            .yDomain(fc.utilities.extent(data, ['high', 'low']))
            .yNice()
            .yTicks(3)
            .plotArea(multi);

        selection.call(chart);
    }

    function volumeChart(selection) {

        var data = selection.datum();

        var gridlines = fc.scale.gridlines()
            .yTicks(2);

        var bar = fc.series.bar()
            .yValue(function(d) { return d.volume; });

        var crosshairs = fc.tools.crosshairs()
            .snap(fc.utilities.seriesPointSnap(bar, data))
            .on('trackingmove.link', render);

        var multi = fc.series.multi()
            .series([gridlines, bar, crosshairs])
            .mapping(function(data, series) {
                switch (series) {
                    case crosshairs:
                        return data.crosshairs;
                    default:
                        return data;
                }
            });

        var chart = fc.charts.linearTimeSeries()
            .xDomain(data.dateDomain)
            .yDomain(fc.utilities.extent(data, 'volume'))
            .yNice()
            .yTicks(2)
            .plotArea(multi);

        selection.call(chart);
    }

    function navigatorChart(selection) {

        var data = selection.datum();

        var yDomain = fc.utilities.extent(data, 'close');

        var chart = fc.charts.linearTimeSeries()
            .xDomain(fc.utilities.extent(data, 'date'))
            .yDomain(yDomain)
            .yNice()
            .xTicks(3)
            .yTicks(0);

        var gridlines = fc.scale.gridlines()
            .xTicks(3)
            .yTicks(0);

        var line = fc.series.line();

        var area = fc.series.area();

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
            .mapping(function(data, series) {
                // Need to set the extent AFTER the scales
                // are set AND their ranges defined
                if (series === brush) {
                    brush.extent([
                        [data.dateDomain[0], chart.yDomain()[0]],
                        [data.dateDomain[1], chart.yDomain()[1]]
                    ]);
                }
                return data;
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
            var maxDate = fc.utilities.extent(container.datum(), 'date')[1];
            var dateScale = d3.time.scale()
                .domain([maxDate - 50 * 24 * 60 * 60 * 1000, maxDate])
                .nice();
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

        // TODO: Add pan/zoom behaviour
    }

    render();

})(d3, fc);
