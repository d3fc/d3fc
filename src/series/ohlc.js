import d3 from 'd3';
import dataJoinUtil from '../util/dataJoin';
import {noop} from '../util/fn';
import svgOhlc from '../svg/ohlc';
import ohlcBase from './ohlcBase';
import {rebindAll} from '../util/rebind';

export default function(drawMethod) {

    var decorate = noop,
        base = ohlcBase();

    var dataJoin = dataJoinUtil()
        .selector('g.ohlc')
        .element('g')
        .attr('class', 'ohlc');

    var ohlc = function(selection) {
        selection.each(function(data, index) {

            var filteredData = data.filter(base.defined);

            var g = dataJoin(this, filteredData);

            g.enter()
                .append('path');

            var pathGenerator = svgOhlc()
                    .width(base.width(filteredData));

            g.each(function(d, i) {
                var values = base.values(d, i);

                var graph = d3.select(this)
                    .attr('class', 'ohlc ' + values.direction)
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

    ohlc.decorate = function(x) {
        if (!arguments.length) {
            return decorate;
        }
        decorate = x;
        return ohlc;
    };

    d3.rebind(ohlc, dataJoin, 'key');
    rebindAll(ohlc, base);

    return ohlc;
}
