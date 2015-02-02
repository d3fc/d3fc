(function(d3, fc) {
    'use strict';

    fc.indicators.relativeStrengthIndicator = function() {

        var algorithm = fc.math.relativeStrengthIndicator();
        var annotations = fc.tools.annotation();
        var rsiLine = fc.series.line();

        var rsi = function(selection) {

            algorithm.outputValue(rsi.writeCalculatedValue.value);

            annotations.xScale(rsi.xScale.value)
                .yScale(rsi.yScale.value);

            rsiLine.xScale(rsi.xScale.value)
                .yScale(rsi.yScale.value)
                .xValue(rsi.xValue.value)
                .yValue(rsi.readCalculatedValue.value);

            selection.each(function(data) {
                algorithm(data);

                var container = d3.select(this);

                var annotationsContainer = container.selectAll('g.annotations')
                    .data([[
                        rsi.upperValue.value.apply(this, arguments),
                        50,
                        rsi.lowerValue.value.apply(this, arguments)
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

        rsi.xScale = fc.utilities.property(d3.time.scale());
        rsi.yScale = fc.utilities.property(d3.scale.linear());
        rsi.xValue = fc.utilities.property(function(d) { return d.date; });
        rsi.writeCalculatedValue = fc.utilities.property(function(d, value) { d.rsi = value; });
        rsi.readCalculatedValue = fc.utilities.property(function(d) { return d.rsi; });
        rsi.upperValue = fc.utilities.functorProperty(70);
        rsi.lowerValue = fc.utilities.functorProperty(30);

        d3.rebind(rsi, algorithm, 'openValue', 'closeValue', 'windowSize');

        return rsi;
    };
}(d3, fc));