(function(d3, fc) {
    'use strict';

    fc.indicators.renderers.macd = function() {

        var xScale = d3.time.scale(),
            yScale = d3.scale.linear(),
            xValue = function(d) { return d.date; };

        var macdLine = fc.series.line(),
            signalLine = fc.series.line(),
            divergenceBar = fc.series.bar(),
            multiSeries = fc.series.multi();

        var macd = function(selection) {

            macdLine
                .xValue(xValue)
                .yValue(function(d, i) { return d.macd.macd; })
                .decorate(function(path) {
                    path.classed('macd', true);
                });

            signalLine
                .xValue(xValue)
                .yValue(function(d, i) { return d.macd.signal; })
                .decorate(function(path) {
                    path.classed('signal', true);
                });

            divergenceBar
                .xValue(xValue)
                .yValue(function(d, i) { return d.macd.divergence; });

            multiSeries
                .xScale(xScale)
                .yScale(yScale)
                .series([divergenceBar, macdLine, signalLine]);

            selection.each(function(data) {
                d3.select(this)
                    .append('g')
                    .classed('macd-indicator', true)
                    .datum(data)
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

        macd.yScale = function(x) {
            if (!arguments.length) {
                return yScale;
            }
            yScale = x;
            return macd;
        };

        return macd;
    };
}(d3, fc));
