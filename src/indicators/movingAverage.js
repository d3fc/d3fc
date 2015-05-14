(function(d3, fc) {
    'use strict';

    fc.indicators.movingAverage = function() {

        var xScale = d3.time.scale(),
            yScale = d3.scale.linear(),
            yValue = function(d) { return d.close; },
            xValue = function(d) { return d.date; };

        var algorithm = fc.indicators.algorithms.slidingWindow()
            .accumulator(d3.mean);

        var averageLine = fc.series.line();

        var movingAverage = function(selection) {

            algorithm.value(yValue);

            averageLine.xScale(xScale)
                .yScale(yScale)
                .xValue(xValue)
                .yValue(function(d, i) { return d.movingAverage; });

            selection.each(function(data) {

                data = d3.zip(data, algorithm(data))
                    .map(function(tuple) {
                        tuple[0].movingAverage = tuple[1];
                        return tuple[0];
                    });

                d3.select(this)
                    .datum(data)
                    .call(averageLine);
            });
        };


        movingAverage.xScale = function(x) {
            if (!arguments.length) {
                return xScale;
            }
            xScale = x;
            return movingAverage;
        };
        movingAverage.yScale = function(x) {
            if (!arguments.length) {
                return yScale;
            }
            yScale = x;
            return movingAverage;
        };
        movingAverage.xValue = function(x) {
            if (!arguments.length) {
                return xValue;
            }
            xValue = x;
            return movingAverage;
        };
        movingAverage.yValue = function(x) {
            if (!arguments.length) {
                return yValue;
            }
            yValue = x;
            return movingAverage;
        };

        d3.rebind(movingAverage, algorithm, 'windowSize');

        return movingAverage;
    };
}(d3, fc));
