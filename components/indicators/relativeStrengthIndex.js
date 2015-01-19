(function(d3, fc) {
    'use strict';

    fc.indicators.relativeStrengthIndicator = function() {

        var algorithm = fc.math.relativeStrengthIndicator();

        var upperLine = fc.series.line();
        var midLine = fc.series.line();
        var lowerLine = fc.series.line();

        var rsiLine = fc.series.line();

        var rsi = function(selection) {

            algorithm.outputValue(rsi.writeCalculatedValue.value);

            upperLine.xScale(rsi.xScale.value)
                .yScale(rsi.yScale.value)
                .xValue(rsi.xValue.value)
                .yValue(rsi.upperValue.value);

            midLine.xScale(rsi.xScale.value)
                .yScale(rsi.yScale.value)
                .xValue(rsi.xValue.value)
                .yValue(d3.functor(50));

            lowerLine.xScale(rsi.xScale.value)
                .yScale(rsi.yScale.value)
                .xValue(rsi.xValue.value)
                .yValue(rsi.lowerValue.value);

            rsiLine.xScale(rsi.xScale.value)
                .yScale(rsi.yScale.value)
                .xValue(rsi.xValue.value)
                .yValue(rsi.readCalculatedValue.value);

            selection.each(function(data) {
                algorithm(data);

                var container = d3.select(this);

                var upperLineContainer = container.selectAll('g.upper')
                    .data([data]);

                upperLineContainer.enter()
                    .append('g')
                    .attr('class', 'upper');

                upperLineContainer.call(upperLine);

                var midLineContainer = container.selectAll('g.mid')
                    .data([data]);

                midLineContainer.enter()
                    .append('g')
                    .attr('class', 'mid');

                midLineContainer.call(midLine);

                var lowerLineContainer = container.selectAll('g.lower')
                    .data([data]);

                lowerLineContainer.enter()
                    .append('g')
                    .attr('class', 'lower');

                lowerLineContainer.call(lowerLine);

                var rsiLineContainer = container.selectAll('g.indicator')
                    .data([data]);

                rsiLineContainer.enter()
                    .append('g')
                    .attr('class', 'indicator');

                rsiLineContainer.call(rsiLine);
            });
        };

        rsi.xScale = fc.utilities.property(d3.time.scale());
        rsi.yScale = fc.utilities.property(d3.scale.linear());
        rsi.xValue = fc.utilities.property(fc.utilities.valueAccessor('date'));
        rsi.writeCalculatedValue = fc.utilities.property(function(d, value) { d.rsi = value; });
        rsi.readCalculatedValue = fc.utilities.property(function(d) { return d.rsi; });
        rsi.upperValue = fc.utilities.functorProperty(70);
        rsi.lowerValue = fc.utilities.functorProperty(30);

        d3.rebind(rsi, algorithm, 'openValue', 'closeValue', 'windowSize');

        return rsi;
    };
}(d3, fc));