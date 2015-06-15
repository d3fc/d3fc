(function(d3, fc) {
    'use strict';

    fc.charts.tableLegend = function() {
        var decorate = fc.utilities.fn.noop,
            items = [
                ['datum', function(d) { return d.datum; }]
            ];

        var legend = function(selection) {
            selection.each(function(data) {
                var container = d3.select(this);

                // map the data to include the datapoint, so that
                // deocrators have access to both the 'items' and 'data'
                var legendData = items.map(function(item) {
                    return {
                        label: item[0],
                        valueFunction: item[1],
                        datum: data
                    };
                });

                var tableEnter = container.selectAll('table')
                    .data([legendData])
                    .enter()
                    .append('table');

                var rowsUpdate = tableEnter.selectAll('tr')
                    .data(function(d) { return d; });

                var rowsEnter = rowsUpdate.enter()
                    .append('tr')
                    .classed('field', true);

                rowsEnter.append('th')
                    .text(function(d) { return d.label; });
                rowsEnter.append('td')
                    .classed('value', true);

                // update
                container.selectAll('td.value')
                    .text(function(d) { return d.valueFunction(data); });

                var decorateSelection = rowsUpdate;
                decorateSelection.enter = d3.functor(rowsEnter);
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