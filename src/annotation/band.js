(function(d3, fc) {
    'use strict';

    fc.annotation.band = function() {

        var defaultValue = {},
            defaultFn = function(d, i) {
                return defaultValue;
            };

        var xScale = d3.time.scale(),
            yScale = d3.scale.linear(),
            x0 = defaultFn,
            y0 = defaultFn,
            x1 = defaultFn,
            y1 = defaultFn,
            decorate = fc.util.fn.noop;

        var dataJoin = fc.util.dataJoin()
            .selector('g.annotation')
            .element('g')
            .attrs({'class': 'annotation'});

        var band = function(selection) {
            selection.each(function(data) {

                var container = d3.select(this);

                // Create a group for each band
                var g = dataJoin(container, data);

                g.enter()
                    .append('path')
                    .classed('band', true);

                // ordinal axes have a rangeExtent function, this adds any padding that
                // was applied to the range. This functions returns the rangeExtent
                // if present, or range otherwise
                function range(scale) {
                    return scale.rangeExtent ? scale.rangeExtent() : scale.range();
                }
                var xScaleRange = range(xScale),
                    yScaleRange = range(yScale);

                function get(d, i, accessor, scale, def) {
                    var value = accessor(d, i);
                    return value !== defaultValue ? scale(value) : def;
                }

                var pathGenerator = fc.svg.bar()
                    .centred(false)
                    .x(function(d, i) {
                        return get(d, i, x0, xScale, xScaleRange(0));
                    })
                    .y(function(d, i) {
                        return get(d, i, y0, yScale, yScaleRange(0));
                    })
                    .height(function(d, i) {
                        return get(d, i, y1, yScaleRange(1)) - get(d, i, y0, yScaleRange(0));
                    })
                    .width(function(d, i) {
                        return get(d, i, x1, xScaleRange(1)) - get(d, i, x0, xScaleRange(0));
                    });

                g.select('path')
                    .attr('d', function(d) { return pathGenerator([d]); });

                decorate(g);
            });
        };

        band.xScale = function(x) {
            if (!arguments.length) {
                return xScale;
            }
            xScale = x;
            return band;
        };
        band.yScale = function(x) {
            if (!arguments.length) {
                return yScale;
            }
            yScale = x;
            return band;
        };
        band.decorate = function(x) {
            if (!arguments.length) {
                return decorate;
            }
            decorate = x;
            return band;
        };
        band.x0 = function(x) {
            if (!arguments.length) {
                return x0;
            }
            x0 = x;
            return band;
        };
        band.x1 = function(x) {
            if (!arguments.length) {
                return x1;
            }
            x1 = x;
            return band;
        };
        band.y0 = function(x) {
            if (!arguments.length) {
                return y0;
            }
            y0 = x;
            return band;
        };
        band.y1 = function(x) {
            if (!arguments.length) {
                return y1;
            }
            y1 = x;
            return band;
        };
        return band;
    };

}(d3, fc));
