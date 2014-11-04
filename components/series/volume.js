define ([
    'd3',
    'sl'
], function (d3, sl) {
    'use strict';

    sl.series.volume = function () {

        var xScale = d3.time.scale(),
            yScale = d3.scale.linear();

        var barWidth = 5;

        var isUpDay = function(d) {
            return d.close > d.open;
        };
        var isDownDay = function (d) {
            return !isUpDay(d);
        };

        var rectangles = function (bars) {
            var rect;

            rect = bars.selectAll('rect').data(function (d) {
                return [d];
            });

            rect.enter().append('rect');

            rect.attr('x', function (d) { return xScale(d.date) - barWidth; })
                .attr('y', function(d) { return yScale(d.volume); } )
                .attr('width', barWidth * 2)
                .attr('height', function(d) { return yScale(0); });
        };

        var volume = function (selection) {
            var series, bars;

            selection.each(function (data) {
                series = d3.select(this).selectAll('.volume-series').data([data]);

                series.enter().append('g')
                    .classed('volume-series', true);

                bars = series.selectAll('.volumebar')
                    .data(data, function (d) {
                        return d.date;
                    });

                bars.enter()
                    .append('g')
                    .classed('volumebar', true);

                bars.classed({
                    'up-day': isUpDay,
                    'down-day': isDownDay
                });
                rectangles(bars);
                bars.exit().remove();
           });
        };

        volume.xScale = function (value) {
            if (!arguments.length) {
                return xScale;
            }
            xScale = value;
            return volume;
        };

        volume.yScale = function (value) {
            if (!arguments.length) {
                return yScale;
            }
            yScale = value;
            return volume;
        };

        volume.barWidth = function (value) {
            if (!arguments.length) {
                return barWidth;
            }
            barWidth = value;
            return volume;
        };

        return volume;
    };
});