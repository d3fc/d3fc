import d3 from 'd3';
import _dataJoin from '../../util/dataJoin';
import {noop} from '../../util/fn';

export default function() {

    var series = noop;

    var stack = function(selection) {

        selection.each(function(data) {

            var container = d3.select(this);

            var dataJoin = _dataJoin()
                .selector('g.stacked')
                .element('g')
                .attr('class', 'stacked');

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
}
