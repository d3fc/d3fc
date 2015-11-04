import _bar from '../../series/bar';
import d3 from 'd3';
import _line from '../../series/line';
import multiSeries from '../../series/multi';
import {noop} from '../../util/fn';

export default function() {

    var xScale = d3.time.scale(),
        yScale = d3.scale.linear(),
        xValue = function(d) { return d.date; },
        root = function(d) { return d.macd; },
        macdLine = _line(),
        signalLine = _line(),
        divergenceBar = _bar(),
        multi = multiSeries('macd'),
        decorate = noop;

    var macd = function(selection) {

        macdLine.xValue(xValue)
            .yValue(function(d, i) { return root(d).macd; });

        signalLine.xValue(xValue)
            .yValue(function(d, i) { return root(d).signal; });

        divergenceBar.xValue(xValue)
            .yValue(function(d, i) { return root(d).divergence; });

        multi
            .xScale(xScale)
            .yScale(yScale)
            .series([divergenceBar, macdLine, signalLine])
            .decorate(function(g, data, index) {
                g.enter()
                    .attr('class', function(d, i) {
                        return 'macd ' + ['divergence', '', 'signal'][i];
                    });
                decorate(g, data, index);
            });

        selection.call(multi);
    };

    macd.xScale = function(x) {
        if (!arguments.length) {
            return xScale;
        }
        xScale = x;
        return macd;
    };
    macd.xValue = function(x) {
        if (!arguments.length) {
            return xValue;
        }
        xValue = x;
        return macd;
    };
    macd.yScale = function(x) {
        if (!arguments.length) {
            return yScale;
        }
        yScale = x;
        return macd;
    };
    macd.root = function(x) {
        if (!arguments.length) {
            return root;
        }
        root = x;
        return macd;
    };
    macd.decorate = function(x) {
        if (!arguments.length) {
            return decorate;
        }
        decorate = x;
        return macd;
    };

    return macd;
}
