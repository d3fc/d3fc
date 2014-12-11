(function (d3, fc) {
    'use strict';

    fc.series.bar = function () {

        var xScale = d3.time.scale(),
            yScale = d3.scale.linear(),
            barWidth = 5,
            yValue = function(d) { return d.volume; },
            classForBar = function(d) { return ''; };

        var volume = function (selection) {
            var series, container;

            selection.each(function (data) {

                // add a 'root' g element
                container = d3.select(this).append('g')
                    .classed("bar-series", true);

                // create a data-join for each rect element
                series = container
                    .selectAll('rect')
                    .data(data);

                // enter
                series.enter()
                    .append('rect');

                // exit
                series.exit()
                    .remove();

                // update
                series.attr('x', function (d) { return xScale(d.date) - (barWidth / 2.0); })
                    .attr('y', function(d) { return yScale(yValue(d)); })
                    .attr('width', barWidth)
                    .attr('height', function(d) { return yScale(0) - yScale(yValue(d)); })
                    .attr('class', classForBar);
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

        volume.classForBar = function (value) {
            if (!arguments.length) {
                return classForBar;
            }
            classForBar = value;
            return volume;
        };

        return volume;
    };
}(d3, fc));
