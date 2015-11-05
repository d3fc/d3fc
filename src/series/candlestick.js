import d3 from 'd3';
import dataJoinUtil from '../util/dataJoin';
import {noop} from '../util/fn';
import candlestickSvg from '../svg/candlestick';
import ohlcBase from './ohlcBase';
import {rebindAll} from '../util/rebind';

export default function() {

    var decorate = noop,
        base = ohlcBase();

    var dataJoin = dataJoinUtil()
        .selector('g.candlestick')
        .element('g')
        .attr('class', 'candlestick');

    var candlestick = function(selection) {

        selection.each(function(data, index) {

            var filteredData = data.filter(base.defined);

            var g = dataJoin(this, filteredData);

            g.enter()
                .append('path');

            var pathGenerator = candlestickSvg()
                    .width(base.width(filteredData));

            g.each(function(d, i) {

                var values = base.values(d, i);

                var graph = d3.select(this)
                    .attr('class', 'candlestick ' + values.direction)
                    .attr('transform', 'translate(' + values.x + ', ' + values.yHigh + ')');

                pathGenerator.x(d3.functor(0))
                    .open(function() { return values.yOpen - values.yHigh; })
                    .high(function() { return values.yHigh - values.yHigh; })
                    .low(function() { return values.yLow - values.yHigh; })
                    .close(function() { return values.yClose - values.yHigh; });

                graph.select('path')
                    .attr('d', pathGenerator([d]));
            });

            decorate(g, data, index);
        });
    };

    candlestick.decorate = function(x) {
        if (!arguments.length) {
            return decorate;
        }
        decorate = x;
        return candlestick;
    };

    d3.rebind(candlestick, dataJoin, 'key');
    rebindAll(candlestick, base);

    return candlestick;

}
