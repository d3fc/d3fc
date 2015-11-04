import d3 from 'd3';
import dataJoinUtil from '../util/dataJoin';
import {noop} from '../util/fn';

export default function() {
    var tableDecorate = noop,
        rowDecorate = noop;

    var items = [
        ['datum', function(d) { return d.datum; }]
    ];

    var tableDataJoin = dataJoinUtil('legend', 'table');
    var rowDataJoin = dataJoinUtil('row', 'tr');

    var legend = function(selection) {
        selection.each(function(data, index) {
            var container = d3.select(this);

            var legendData = items.map(function(item, i) {
                return {
                    datum: data,
                    header: d3.functor(item[0]),
                    value: d3.functor(item[1])
                };
            });

            var table = tableDataJoin(container, [legendData]);

            var trUpdate = rowDataJoin(table);

            var trEnter = trUpdate.enter();
            trEnter.append('th');
            trEnter.append('td');

            trUpdate.select('th')
                .html(function(d, i) {
                    return d.header.call(this, d.datum, i);
                });

            trUpdate.select('td')
                .html(function(d, i) {
                    return d.value.call(this, d.datum, i);
                });

            tableDecorate(table, data, index);
            rowDecorate(trUpdate, data, index);
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
}
