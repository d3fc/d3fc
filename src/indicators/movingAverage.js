(function(d3, fc) {
    'use strict';

    fc.indicators.movingAverage = function() {

        var algorithm = fc.indicators.algorithms.slidingWindow()
            .accumulator(d3.mean);

        var averageLine = fc.series.line();

        var movingAverage = function(selection) {

            algorithm.inputValue(movingAverage.yValue.value)
                .outputValue(movingAverage.writeCalculatedValue.value);

            averageLine.xScale(movingAverage.xScale.value)
                .yScale(movingAverage.yScale.value)
                .xValue(movingAverage.xValue.value)
                .yValue(movingAverage.readCalculatedValue.value);

            selection.each(function(data) {
                algorithm(data);

                d3.select(this)
                    .call(averageLine);
            });
        };

        movingAverage.xScale = fc.utilities.property(d3.time.scale());
        movingAverage.yScale = fc.utilities.property(d3.scale.linear());
        movingAverage.yValue = fc.utilities.property(function(d) { return d.close; });
        movingAverage.xValue = fc.utilities.property(function(d) { return d.date; });
        movingAverage.writeCalculatedValue = fc.utilities.property(function(d, value) { d.movingAverage = value; });
        movingAverage.readCalculatedValue = fc.utilities.property(function(d) { return d.movingAverage; });

        d3.rebind(movingAverage, algorithm, 'windowSize');

        return movingAverage;
    };
}(d3, fc));
