(function(d3, fc) {
    'use strict';

    fc.indicators.bollingerBands = function() {

        var algorithm = fc.indicators.algorithms.bollingerBands(),
            xScale = d3.time.scale(),
            yScale = d3.scale.linear(),
            yValue = function(d, i) { return d.close; },
            xValue = function(d, i) { return d.date; };

        var area = fc.series.area()
            .y0Value(function(d, i) {
                return d.upper;
            })
            .y1Value(function(d, i) {
                return d.lower;
            });

        var upperLine = fc.series.line()
            .yValue(function(d, i) {
                return d.upper;
            });

        var averageLine = fc.series.line()
            .yValue(function(d, i) {
                return d.average;
            });

        var lowerLine = fc.series.line()
            .yValue(function(d, i) {
                return d.lower;
            });

        var bollingerBands = function(selection) {

            algorithm.value(yValue);

            area.xScale(xScale)
                .yScale(yScale)
                .xValue(xValue);

            upperLine.xScale(xScale)
                .yScale(yScale)
                .xValue(xValue);

            averageLine.xScale(xScale)
                .yScale(yScale)
                .xValue(xValue);

            lowerLine.xScale(xScale)
                .yScale(yScale)
                .xValue(xValue);

            selection.each(function(data) {

                data = d3.zip(data, algorithm(data))
                    .map(function(tuple) {
                        tuple[0].upper = tuple[1].upper;
                        tuple[0].average = tuple[1].average;
                        tuple[0].lower = tuple[1].lower;
                        return tuple[0];
                    });

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

        bollingerBands.xScale = function(x) {
            if (!arguments.length) {
                return xScale;
            }
            xScale = x;
            return bollingerBands;
        };
        bollingerBands.yScale = function(x) {
            if (!arguments.length) {
                return yScale;
            }
            yScale = x;
            return bollingerBands;
        };
        bollingerBands.xValue = function(x) {
            if (!arguments.length) {
                return xValue;
            }
            xValue = x;
            return bollingerBands;
        };
        bollingerBands.yValue = function(x) {
            if (!arguments.length) {
                return yValue;
            }
            yValue = x;
            return bollingerBands;
        };

        d3.rebind(bollingerBands, algorithm, 'multiplier', 'windowSize');

        return bollingerBands;
    };
}(d3, fc));
