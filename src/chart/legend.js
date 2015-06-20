(function(d3, fc) {
    'use strict';

    fc.chart.legend = function() {
        var tableDecorate = fc.util.fn.noop,
            rowDecorate = fc.util.fn.noop;

        var items = [
                ['datum', function(d) { return d.datum; }]
            ];

        var tableDataJoin = fc.util.dataJoin()
            .selector('table.legend')
            .element('table')
            .attrs({'class': 'legend'});

        var rowDataJoin = fc.util.dataJoin()
            .selector('tr.row')
            .element('tr')
            .attrs({'class': 'row'});

        var legend = function(selection) {
            selection.each(function(data) {
                var container = d3.select(this);

                var legendData = items.map(function(item, i) {
                    return [
                        {
                            value: d3.functor(item[0]),
                            index: i,
                            datum: data
                        },
                        {
                            value: d3.functor(item[1]),
                            index: i,
                            datum: data
                        }
                    ];
                });

                var table = tableDataJoin(container, [legendData]);

                var trUpdate = rowDataJoin(table);

                var trEnter = trUpdate.enter();
                trEnter.append('th');
                trEnter.append('td');

                trUpdate.select('th')
                    .html(function(d) {
                        return d[0].value(d[0].datum);
                    });

                trUpdate.select('td')
                    .html(function(d) {
                        return d[1].value(d[1].datum);
                    });

                tableDecorate(table);
                rowDecorate(trUpdate);
            });
        };

        legend.items = function(x) {
            if (!arguments.length) {
                return items;
            }
            items = x;
            return legend;
        };

        legend.rowDecorate = function(x) {
            if (!arguments.length) {
                return rowDecorate;
            }
            rowDecorate = x;
            return legend;
        };

        legend.tableDecorate = function(x) {
            if (!arguments.length) {
                return tableDecorate;
            }
            tableDecorate = x;
            return legend;
        };

        return legend;
    };

})(d3, fc);