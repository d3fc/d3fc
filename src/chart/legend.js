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
                var legendData = items.map(function(item, i) {
                    return [
                        {
                            value: d3.functor(item[0]),
                            index: i,
                            datum: data,
                            class: 'label'
                        },
                        {
                            value: d3.functor(item[1]),
                            index: i,
                            datum: data,
                            class: 'value'
                        }
                    ];
                });

                var table = container.selectAll('table')
                    .data([legendData]);
                table.enter()
                    .append('table')
                    .classed('legend', true);

                // create the rows
                var tr = table.selectAll('tr')
                  .data(function(d) { return d; });

                tr.enter()
                  .append('tr');
                tr.exit().remove();

                // create the cells
                var tdUpdate = tr.selectAll('td')
                  .data(function(d) { return d; });

                var tdEnter = tdUpdate.enter()
                    .append('td')
                    .attr('class', function(d) { return d.class; });
                var tdExit = tdUpdate.exit()
                    .remove();

                // update cell contents
                tdUpdate.html(function(d) {
                    return d.value(d.datum);
                });

                tdUpdate.enter = d3.functor(tdEnter);
                tdUpdate.exit = d3.functor(tdExit);
                decorate(tdUpdate);
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