(function(d3, fc) {
    'use strict';

    fc.series.line = function() {

        var decorate = fc.utilities.fn.noop,
            xScale = d3.time.scale(),
            yScale = d3.scale.linear(),
            yValue = function(d) { return d.close; },
            xValue = function(d) { return d.date; };

        // convenience functions that return the x & y screen coords for a given point
        var x = function(d) { return xScale(xValue(d)); };
        var y = function(d) { return yScale(yValue(d)); };

        var lineData = d3.svg.line()
            .defined(function(d) {
                return !isNaN(y(d));
            })
            .x(x)
            .y(y);

        var line = function(selection) {

            selection.each(function(data) {

                var path = d3.select(this)
                    .selectAll('path.line')
                    .data([data]);

                path.enter()
                    .append('path')
                    .attr('class', 'line');

                path.attr('d', lineData);

                decorate(path);
            });
        };

        line.decorate = function(x) {
            if (!arguments.length) {
                return decorate;
            }
            decorate = x;
            return line;
        };
        line.xScale = function(x) {
            if (!arguments.length) {
                return xScale;
            }
            xScale = x;
            return line;
        };
        line.yScale = function(x) {
            if (!arguments.length) {
                return yScale;
            }
            yScale = x;
            return line;
        };
        line.xValue = function(x) {
            if (!arguments.length) {
                return xValue;
            }
            xValue = x;
            return line;
        };
        line.yValue = function(x) {
            if (!arguments.length) {
                return yValue;
            }
            yValue = x;
            return line;
        };

        return d3.rebind(line, lineData, 'interpolate', 'tension');
    };
}(d3, fc));
