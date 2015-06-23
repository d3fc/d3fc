(function(d3, fc) {
    'use strict';

    fc.series.stacked.bar = function() {

        var bar = fc.series.bar()
            .yValue(function(d) { return d.y0 + d.y; })
            .y0Value(function(d) { return d.y0; });

        var stack = fc.series.stacked.stack()
            .series(bar);

        var stackedBar = function(selection) {
            selection.call(stack);
        };

        return fc.util.rebind(stackedBar, bar, {
            decorate: 'decorate',
            xScale: 'xScale',
            yScale: 'yScale',
            xValue: 'xValue',
            y0Value: 'y0Value',
            y1Value: 'y1Value',
            yValue: 'yValue',
            barWidth: 'barWidth'
        });
    };

}(d3, fc));