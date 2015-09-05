(function(d3, fc) {
    'use strict';

    fc.indicator.renderer.relativeStrengthIndex = function() {

        var xScale = d3.time.scale(),
            yScale = d3.scale.linear(),
            upperValue = 70,
            lowerValue = 30,
            multiSeries = fc.series.multi(),
            decorate = fc.util.fn.noop;

        var annotations = fc.annotation.line();
        var rsiLine = fc.series.line()
            .yValue(function(d, i) { return d.rsi; });

        var rsi = function(selection) {

            multiSeries.xScale(xScale)
                .yScale(yScale)
                .series([annotations, rsiLine])
                .mapping(function(series) {
                    if (series === annotations) {
                        return [
                            upperValue,
                            50,
                            lowerValue
                        ];
                    }
                    return this;
                })
                .decorate(function(g, data, index) {
                    g.enter()
                        .attr('class', function(d, i) {
                            return 'multi ' + ['annotations', 'indicator'][i];
                        });
                    decorate(g, data, index);
                });

            selection.call(multiSeries);
        };

        rsi.xScale = function(x) {
            if (!arguments.length) {
                return xScale;
            }
            xScale = x;
            return rsi;
        };
        rsi.yScale = function(x) {
            if (!arguments.length) {
                return yScale;
            }
            yScale = x;
            return rsi;
        };
        rsi.upperValue = function(x) {
            if (!arguments.length) {
                return upperValue;
            }
            upperValue = x;
            return rsi;
        };
        rsi.lowerValue = function(x) {
            if (!arguments.length) {
                return lowerValue;
            }
            lowerValue = x;
            return rsi;
        };
        rsi.decorate = function(x) {
            if (!arguments.length) {
                return decorate;
            }
            decorate = x;
            return rsi;
        };

        d3.rebind(rsi, rsiLine, 'yValue', 'xValue');

        return rsi;
    };
}(d3, fc));
