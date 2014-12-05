(function (d3, fc) {
    'use strict';

    fc.series.volume = function () {

        var xScale = d3.time.scale(),
            yScale = d3.scale.linear(),
            barWidth = 5,
            yValue = function(d) { return d.volume; };

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

            rect.attr('x', function (d) { return xScale(d.date) - (barWidth / 2.0); })
                .attr('y', function(d) { return yScale(yValue(d)); })
                .attr('width', barWidth)
                .attr('height', function(d) { return yScale(0) - yScale(yValue(d)); });
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

        volume.yValue = function (value) {
            if (!arguments.length) {
                return yValue;
            }
            yValue = value;
            return volume;
        };

        return volume;
    };
}(d3, fc));
