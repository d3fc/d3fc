(function(d3, fc) {
    'use strict';

    fc.charts.legend = function() {
        var decorate = fc.utilities.fn.noop,
            items = [
                ['datum', function(d) { return d.datum; }]
            ];

        var legend = function(selection) {
            selection.each(function(data) {
                var container = d3.select(this);

                // map the data to include the datapoint, so that
                // decorators have access to both the 'items' and 'data'
                var legendData = items.map(function(item) {
                    return {
                        label: d3.functor(item[0]),
                        value: d3.functor(item[1]),
                        datum: data
                    };
                });

                var tableEnter = container.selectAll('table')
                    .data([legendData])
                    .enter()
                    .append('table')
                    .classed('legend', true);

                var rowsUpdate = tableEnter.selectAll('tr')
                    .data(function(d) { return d; });

                var rowsEnter = rowsUpdate.enter()
                    .append('tr');

                rowsEnter.append('td')
                    .classed('label', true);
                rowsEnter.append('td')
                    .classed('value', true);

                // update
                container.selectAll('td.label')
                    .html(function(d, i) {
                        return d.label(d.datum, i);
                    });

                container.selectAll('td.value')
                    .html(function(d, i) {
                        return d.value(d.datum, i);
                    });

                var decorateSelection = container.selectAll('tr');
                decorateSelection.enter = d3.functor(rowsEnter);
                decorateSelection.exit = d3.functor(rowsUpdate.exit());
                decorate(decorateSelection);
            });
        };

        legend.decorate = function(x) {
            if (!arguments.length) {
                return decorate;
            }
            decorate = x;
            return legend;
        };

        legend.items = function(x) {
            if (!arguments.length) {
                return items;
            }
            items = x;
            return legend;
        };

        return legend;
    };

})(d3, fc);