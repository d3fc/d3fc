(function(d3, fc) {
    'use strict';

    fc.indicators.movingAverage = function() {

        var xScale = d3.time.scale(),
            yScale = d3.scale.linear(),
            yValue = function(d) { return d.close; },
            xValue = function(d) { return d.date; },
            writeCalculatedValue = function(d, value) { d.movingAverage = value; },
            readCalculatedValue = function(d) { return d.movingAverage; };

        var algorithm = fc.indicators.algorithms.slidingWindow()
            .accumulator(d3.mean);

        var averageLine = fc.series.line();

        var movingAverage = function(selection) {

            algorithm.inputValue(yValue)
                .outputValue(writeCalculatedValue);

            averageLine.xScale(xScale)
                .yScale(yScale)
                .xValue(xValue)
                .yValue(readCalculatedValue);

            selection.each(function(data) {
                algorithm(data);

                d3.select(this)
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
        movingAverage.writeCalculatedValue = function(x) {
            if (!arguments.length) {
                return writeCalculatedValue;
            }
            writeCalculatedValue = x;
            return movingAverage;
        };
        movingAverage.readCalculatedValue = function(x) {
            if (!arguments.length) {
                return readCalculatedValue;
            }
            readCalculatedValue = x;
            return movingAverage;
        };

        d3.rebind(movingAverage, algorithm, 'windowSize');

        return movingAverage;
    };
}(d3, fc));
