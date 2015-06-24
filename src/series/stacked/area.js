(function(d3, fc) {
    'use strict';

    fc.series.stacked.area = function() {

        var area = fc.series.area()
            .yValue(function(d) { return d.y0 + d.y; })
            .y0Value(function(d) { return d.y0; });

        var stack = fc.series.stacked.stack()
            .series(area);

        var stackedArea = function(selection) {
            selection.call(stack);
        };

        return fc.util.rebind(stackedArea, area, {
            decorate: 'decorate',
            xScale: 'xScale',
            yScale: 'yScale',
            xValue: 'xValue',
            y0Value: 'y0Value',
            y1Value: 'y1Value',
            yValue: 'yValue'
        });
    };

}(d3, fc));
