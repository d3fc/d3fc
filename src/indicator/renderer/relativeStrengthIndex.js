import d3 from 'd3';
import annotationLine from '../../annotation/line';
import multiSeries from '../../series/multi';
import {noop} from '../../util/fn';
import seriesLine from '../../series/line';

export default function() {

    var xScale = d3.time.scale(),
        yScale = d3.scale.linear(),
        upperValue = 70,
        lowerValue = 30,
        multi = multiSeries('rsi'),
        decorate = noop;

    var annotations = annotationLine();
    var rsiLine = seriesLine()
        .yValue(function(d, i) { return d.rsi; });

    var rsi = function(selection) {

        multi
            .xScale(xScale)
            .yScale(yScale)
            .series([annotations, rsiLine])
            .decorate(function(g, data, index) {
                g.enter()
                    .attr('class', function(d, i) {
                        return 'rsi ' + ['', 'signal'][i];
                    });
                decorate(g, data, index);
            })
            .mapping(function(series) {
                if (series === annotations) {
                    return [
                        upperValue,
                        50,
                        lowerValue
                    ];
                }
                return this;
            });

        selection.call(multi);
    };

    rsi.xScale = function(x) {
        if (!arguments.length) {
            return xScale;
        }
        xScale = x;
        return rsi;
    };
    rsi.yScale = function(x) {
        if (!arguments.length) {
            return yScale;
        }
        yScale = x;
        return rsi;
    };
    rsi.upperValue = function(x) {
        if (!arguments.length) {
            return upperValue;
        }
        upperValue = x;
        return rsi;
    };
    rsi.lowerValue = function(x) {
        if (!arguments.length) {
            return lowerValue;
        }
        lowerValue = x;
        return rsi;
    };
    rsi.decorate = function(x) {
        if (!arguments.length) {
            return decorate;
        }
        decorate = x;
        return rsi;
    };

    d3.rebind(rsi, rsiLine, 'yValue', 'xValue');

    return rsi;
}
