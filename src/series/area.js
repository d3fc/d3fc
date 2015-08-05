(function(d3, fc) {
    'use strict';

    fc.series.area = function() {

        var decorate = fc.util.fn.noop,
            xScale = d3.time.scale(),
            yScale = d3.scale.linear(),
            y0Value = d3.functor(0),
            y1Value = function(d, i) { return d.close; },
            xValue = function(d, i) { return d.date; };

        // convenience functions that return the x & y screen coords for a given point
        var x = function(d, i) { return xScale(xValue(d, i)); };
        var y0 = function(d, i) { return yScale(y0Value(d, i)); };
        var y1 = function(d, i) { return yScale(y1Value(d, i)); };

        var areaData = d3.svg.area()
            .defined(function(d, i) {
                return !isNaN(y0(d, i)) && !isNaN(y1(d, i));
            })
            .x(x)
            .y0(y0)
            .y1(y1);

        var dataJoin = fc.util.dataJoin()
            .selector('path.area')
            .element('path')
            .attrs({'class': 'area'});

        var area = function(selection) {

            selection.each(function(data, index) {

                var path = dataJoin(this, [data]);
                path.attr('d', areaData);

                decorate(path, data, index);
            });
        };

        area.decorate = function(x) {
            if (!arguments.length) {
                return decorate;
            }
            decorate = x;
            return area;
        };
        area.xScale = function(x) {
            if (!arguments.length) {
                return xScale;
            }
            xScale = x;
            return area;
        };
        area.yScale = function(x) {
            if (!arguments.length) {
                return yScale;
            }
            yScale = x;
            return area;
        };
        area.xValue = function(x) {
            if (!arguments.length) {
                return xValue;
            }
            xValue = x;
            return area;
        };
        area.y0Value = function(x) {
            if (!arguments.length) {
                return y0Value;
            }
            y0Value = d3.functor(x);
            return area;
        };
        area.yValue = area.y1Value = function(x) {
            if (!arguments.length) {
                return y1Value;
            }
            y1Value = x;
            return area;
        };

        d3.rebind(area, dataJoin, 'key');
        d3.rebind(area, areaData, 'interpolate', 'tension');

        return area;
    };
}(d3, fc));
