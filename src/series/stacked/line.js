(function(d3, fc) {
    'use strict';

    fc.series.stacked.line = function() {

        var line = fc.series.line()
            .yValue(function(d) { return d.y0 + d.y; });

        var stack = fc.series.stacked.stack()
            .series(line);

        var stackedLine = function(selection) {
            selection.call(stack);
        };

        return fc.util.rebind(stackedLine, line, {
            decorate: 'decorate',
            xScale: 'xScale',
            yScale: 'yScale',
            xValue: 'xValue',
            yValue: 'yValue'
        });
    };

}(d3, fc));
