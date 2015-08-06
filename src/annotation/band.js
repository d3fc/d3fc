(function(d3, fc) {
    'use strict';

    fc.annotation.band = function() {

        var xScale = d3.time.scale(),
            yScale = d3.scale.linear(),
            x0, x1, y0, y1,
            x0Scaled = function() {
                return fc.util.scale.range(xScale)[0];
            },
            x1Scaled = function() {
                return fc.util.scale.range(xScale)[1];
            },
            y0Scaled = function() {
                return fc.util.scale.range(yScale)[0];
            },
            y1Scaled = function() {
                return fc.util.scale.range(yScale)[1];
            },
            decorate = fc.util.fn.noop;

        var dataJoin = fc.util.dataJoin()
            .selector('g.annotation')
            .element('g')
            .attr({'class': 'annotation'});

        var band = function(selection) {
            selection.each(function(data, index) {

                var container = d3.select(this);

                var g = dataJoin(container, data);

                g.enter()
                    .append('path')
                    .classed('band', true);

                var pathGenerator = fc.svg.bar()
                    .align('right')
                    .x(x0Scaled)
                    .y(y0Scaled)
                    .height(function() {
                        return y1Scaled.apply(this, arguments) - y0Scaled.apply(this, arguments);
                    })
                    .width(function() {
                        return x1Scaled.apply(this, arguments) - x0Scaled.apply(this, arguments);
                    });

                g.select('path')
                    .attr('d', function(d, i) {
                        // the path generator is being used to render a single path, hence
                        // an explicit index is provided
                        return pathGenerator.call(this, [d], i);
                    });

                decorate(g, data, index);
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
            x0 = d3.functor(x);
            x0Scaled = function() {
                return xScale(x0.apply(this, arguments));
            };
            return band;
        };
        band.x1 = function(x) {
            if (!arguments.length) {
                return x1;
            }
            x1 = d3.functor(x);
            x1Scaled = function() {
                return xScale(x1.apply(this, arguments));
            };
            return band;
        };
        band.y0 = function(x) {
            if (!arguments.length) {
                return y0;
            }
            y0 = d3.functor(x);
            y0Scaled = function() {
                return yScale(y0.apply(this, arguments));
            };
            return band;
        };
        band.y1 = function(x) {
            if (!arguments.length) {
                return y1;
            }
            y1 = d3.functor(x);
            y1Scaled = function() {
                return yScale(y1.apply(this, arguments));
            };
            return band;
        };
        return band;
    };

}(d3, fc));
