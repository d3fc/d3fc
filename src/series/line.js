(function(d3, fc) {
    'use strict';

    fc.series.line = function() {

        var decorate = fc.util.fn.noop,
            xScale = d3.time.scale(),
            yScale = d3.scale.linear(),
            yValue = function(d, i) { return d.close; },
            xValue = function(d, i) { return d.date; };

        // convenience functions that return the x & y screen coords for a given point
        var x = function(d, i) { return xScale(xValue(d, i)); };
        var y = function(d, i) { return yScale(yValue(d, i)); };

        var lineData = d3.svg.line()
            .defined(function(d, i) {
                return !isNaN(y(d, i));
            })
            .x(x)
            .y(y);

        var dataJoin = fc.util.dataJoin()
            .selector('path.line')
            .element('path')
            .attr('class', 'line');

        var line = function(selection) {

            selection.each(function(data, index) {

                var path = dataJoin(this, [data]);
                path.attr('d', lineData);

                decorate(path, data, index);
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

        d3.rebind(line, dataJoin, 'key');
        d3.rebind(line, lineData, 'interpolate', 'tension');

        return line;
    };
}(d3, fc));
