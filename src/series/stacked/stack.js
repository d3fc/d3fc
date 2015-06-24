(function(d3, fc) {
    'use strict';

    fc.series.stacked.stack = function() {

        var series = fc.util.fn.noop;

        var stack = function(selection) {

            selection.each(function(data) {

                var container = d3.select(this);

                var dataJoin = fc.util.dataJoin()
                    .selector('g.stacked')
                    .element('g')
                    .attrs({'class': 'stacked'});

                dataJoin(container, data)
                    .call(series);
            });
        };

        stack.series = function(x) {
            if (!arguments.length) {
                return series;
            }
            series = x;
            return stack;
        };

        return stack;
    };
}(d3, fc));