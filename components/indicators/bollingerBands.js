(function(d3, fc) {
    'use strict';

    fc.indicators.bollingerBands = function() {

        var algorithm = fc.indicators.algorithms.bollingerBands();

        var readCalculatedValue = function(d) {
            return bollingerBands.readCalculatedValue.value(d) || {};
        };

        var area = fc.series.area()
            .y0Value(function(d) {
                return readCalculatedValue(d).upper;
            })
            .y1Value(function(d) {
                return readCalculatedValue(d).lower;
            });

        var upperLine = fc.series.line()
            .yValue(function(d) {
                return readCalculatedValue(d).upper;
            });

        var averageLine = fc.series.line()
            .yValue(function(d) {
                return readCalculatedValue(d).average;
            });

        var lowerLine = fc.series.line()
            .yValue(function(d) {
                return readCalculatedValue(d).lower;
            });

        var bollingerBands = function(selection) {

            algorithm.inputValue(bollingerBands.yValue.value)
                .outputValue(bollingerBands.writeCalculatedValue.value);

            area.xScale(bollingerBands.xScale.value)
                .yScale(bollingerBands.yScale.value)
                .xValue(bollingerBands.xValue.value);

            upperLine.xScale(bollingerBands.xScale.value)
                .yScale(bollingerBands.yScale.value)
                .xValue(bollingerBands.xValue.value);

            averageLine.xScale(bollingerBands.xScale.value)
                .yScale(bollingerBands.yScale.value)
                .xValue(bollingerBands.xValue.value);

            lowerLine.xScale(bollingerBands.xScale.value)
                .yScale(bollingerBands.yScale.value)
                .xValue(bollingerBands.xValue.value);

            selection.each(function(data) {
                algorithm(data);

                var container = d3.select(this);

                var areaContianer = container.selectAll('g.area')
                    .data([data]);

                areaContianer.enter()
                    .append('g')
                    .attr('class', 'area');

                areaContianer.call(area);

                var upperLineContainer = container.selectAll('g.upper')
                    .data([data]);

                upperLineContainer.enter()
                    .append('g')
                    .attr('class', 'upper');

                upperLineContainer.call(upperLine);

                var averageLineContainer = container.selectAll('g.average')
                    .data([data]);

                averageLineContainer.enter()
                    .append('g')
                    .attr('class', 'average');

                averageLineContainer.call(averageLine);

                var lowerLineContainer = container.selectAll('g.lower')
                    .data([data]);

                lowerLineContainer.enter()
                    .append('g')
                    .attr('class', 'lower');

                lowerLineContainer.call(lowerLine);
            });
        };

        bollingerBands.xScale = fc.utilities.property(d3.time.scale());
        bollingerBands.yScale = fc.utilities.property(d3.scale.linear());
        bollingerBands.yValue = fc.utilities.property(function(d) { return d.close; });
        bollingerBands.xValue = fc.utilities.property(function(d) { return d.date; });
        bollingerBands.writeCalculatedValue = fc.utilities.property(function(d, value) { d.bollingerBands = value; });
        bollingerBands.readCalculatedValue = fc.utilities.property(function(d) { return d.bollingerBands; });

        d3.rebind(bollingerBands, algorithm, 'multiplier', 'windowSize');

        return bollingerBands;
    };
}(d3, fc));
