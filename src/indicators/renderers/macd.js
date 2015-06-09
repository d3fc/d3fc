(function(d3, fc) {
    'use strict';

    fc.indicators.renderers.macd = function() {

        var xScale = d3.time.scale(),
            yScale = d3.scale.linear(),
            xValue = function(d) { return d.date; },
            root = function(d) { return d.macd; },
            macdLine = fc.series.line(),
            signalLine = fc.series.line(),
            divergenceBar = fc.series.bar(),
            multiSeries = fc.series.multi();

        var macd = function(selection) {

            macdLine
                .xValue(xValue)
                .yValue(function(d, i) { return root(d).macd; })
                .decorate(function(path) {
                    path.classed('macd', true);
                });

            signalLine
                .xValue(xValue)
                .yValue(function(d, i) { return root(d).signal; })
                .decorate(function(path) {
                    path.classed('signal', true);
                });

            divergenceBar
                .xValue(xValue)
                .yValue(function(d, i) { return root(d).divergence; });

            multiSeries
                .xScale(xScale)
                .yScale(yScale)
                .series([divergenceBar, macdLine, signalLine]);

            selection.each(function(data) {
                d3.select(this)
                    .append('g')
                    .classed('macd-indicator', true)
                    .call(multiSeries);
            });
        };

        macd.xScale = function(x) {
            if (!arguments.length) {
                return xScale;
            }
            xScale = x;
            return macd;
        };

        macd.xValue = function(x) {
            if (!arguments.length) {
                return xValue;
            }
            xValue = x;
            return macd;
        };

        macd.yScale = function(x) {
            if (!arguments.length) {
                return yScale;
            }
            yScale = x;
            return macd;
        };

        macd.root = function(x) {
            if (!arguments.length) {
                return root;
            }
            root = x;
            return macd;
        };

        return macd;
    };
}(d3, fc));
