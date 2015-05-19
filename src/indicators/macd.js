(function(d3, fc) {
    'use strict';

    fc.indicators.macd = function() {

        var xScale = d3.time.scale(),
            yScale = d3.scale.linear(),
            yValue = function(d) { return d.close; },
            xValue = function(d) { return d.date; },
            algorithm = fc.indicators.algorithms.macd();

        var macdLine = fc.series.line();

        var macd = function(selection) {

            algorithm.value(yValue);

            macdLine.xScale(xScale)
                .yScale(yScale)
                .xValue(xValue)
                .yValue(function(d, i) { return d.macd; });

            selection.each(function(data) {

                d3.zip(data, algorithm(data))
                    .forEach(function(tuple) {
                        tuple[0].macd = tuple[1].macd;
                    });

                d3.select(this)
                    .call(macdLine);
            });
        };


        return macd;
    };
}(d3, fc));
