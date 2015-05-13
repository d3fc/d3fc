(function(d3, fc) {
    'use strict';

    fc.indicators.relativeStrengthIndicator = function() {

        var xScale = d3.time.scale(),
            yScale = d3.scale.linear(),
            xValue = function(d) { return d.date; },
            writeCalculatedValue = function(d, value) { d.rsi = value; },
            readCalculatedValue = function(d) { return d.rsi; },
            upperValue = d3.functor(70),
            lowerValue = d3.functor(30);

        var algorithm = fc.indicators.algorithms.relativeStrengthIndicator();
        var annotations = fc.tools.annotation();
        var rsiLine = fc.series.line();

        var rsi = function(selection) {

            algorithm.outputValue(writeCalculatedValue);

            annotations.xScale(xScale)
                .yScale(yScale);

            rsiLine.xScale(xScale)
                .yScale(yScale)
                .xValue(xValue)
                .yValue(readCalculatedValue);

            selection.each(function(data) {
                algorithm(data);

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
        rsi.writeCalculatedValue = function(x) {
            if (!arguments.length) {
                return writeCalculatedValue;
            }
            writeCalculatedValue = x;
            return rsi;
        };
        rsi.readCalculatedValue = function(x) {
            if (!arguments.length) {
                return readCalculatedValue;
            }
            readCalculatedValue = x;
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

        d3.rebind(rsi, algorithm, 'openValue', 'closeValue', 'windowSize');

        return rsi;
    };
}(d3, fc));
