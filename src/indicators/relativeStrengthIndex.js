(function(d3, fc) {
    'use strict';

    fc.indicators.relativeStrengthIndex = function() {

        var xScale = d3.time.scale(),
            yScale = d3.scale.linear(),
            xValue = function(d) { return d.date; },
            upperValue = d3.functor(70),
            lowerValue = d3.functor(30);

        var annotations = fc.tools.annotation();
        var rsiLine = fc.series.line();

        var rsi = function(selection) {

            annotations.xScale(xScale)
                .yScale(yScale);

            rsiLine.xScale(xScale)
                .yScale(yScale)
                .xValue(xValue)
                .yValue(function(d, i) { return d.rsi; });

            selection.each(function(data) {

                var container = d3.select(this);

                var annotationsContainer = container.selectAll('g.annotations')
                    .data([[
                        upperValue.apply(this, arguments),
                        50,
                        lowerValue.apply(this, arguments)
                    ]]);

                annotationsContainer.enter()
                    .append('g')
                    .attr('class', 'annotations');

                annotationsContainer.call(annotations);

                var rsiLineContainer = container.selectAll('g.indicator')
                    .data([data]);

                rsiLineContainer.enter()
                    .append('g')
                    .attr('class', 'indicator');

                rsiLineContainer.call(rsiLine);
            });
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
        rsi.xValue = function(x) {
            if (!arguments.length) {
                return xValue;
            }
            xValue = x;
            return rsi;
        };
        rsi.upperValue = function(x) {
            if (!arguments.length) {
                return upperValue;
            }
            upperValue = d3.functor(x);
            return rsi;
        };
        rsi.lowerValue = function(x) {
            if (!arguments.length) {
                return lowerValue;
            }
            lowerValue = d3.functor(x);
            return rsi;
        };

        return rsi;
    };
}(d3, fc));
