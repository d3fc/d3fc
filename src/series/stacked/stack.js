import d3 from 'd3';
import _dataJoin from '../../util/dataJoin';
import {noop} from '../../util/fn';

export default function() {

    var series = noop,
        values = function(d) { return d.values; };

    var stack = function(selection) {

        selection.each(function(data) {

            var container = d3.select(this);

            var dataJoin = _dataJoin()
                .selector('g.stacked')
                .element('g')
                .attr('class', 'stacked');

            var g = dataJoin(container, data);

            g.enter().append('g');
            g.select('g')
                .datum(values)
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
    stack.values = function(x) {
        if (!arguments.length) {
            return values;
        }
        values = x;
        return stack;
    };

    return stack;
}
