import _area from '../../series/area';
import d3 from 'd3';
import _line from '../../series/line';
import _multi from '../../series/multi';
import {noop} from '../../util/fn';

export default function() {

    var xScale = d3.time.scale(),
        yScale = d3.scale.linear(),
        yValue = function(d, i) { return d.close; },
        xValue = function(d, i) { return d.date; },
        root = function(d) { return d.bollingerBands; },
        decorate = noop;

    var area = _area()
        .y0Value(function(d, i) {
            return root(d).upper;
        })
        .y1Value(function(d, i) {
            return root(d).lower;
        });

    var upperLine = _line()
        .yValue(function(d, i) {
            return root(d).upper;
        });

    var averageLine = _line()
        .yValue(function(d, i) {
            return root(d).average;
        });

    var lowerLine = _line()
        .yValue(function(d, i) {
            return root(d).lower;
        });

    var bollingerBands = function(selection) {

        var multi = _multi('bollinger')
            .xScale(xScale)
            .yScale(yScale)
            .series([area, upperLine, lowerLine, averageLine])
            .decorate(function(g, data, index) {
                g.enter()
                    .attr('class', function(d, i) {
                        return 'bollinger ' + ['indicator', 'upper', 'lower', 'average'][i];
                    });
                decorate(g, data, index);
            });

        area.xValue(xValue);
        upperLine.xValue(xValue);
        averageLine.xValue(xValue);
        lowerLine.xValue(xValue);

        selection.call(multi);
    };

    bollingerBands.xScale = function(x) {
        if (!arguments.length) {
            return xScale;
        }
        xScale = x;
        return bollingerBands;
    };
    bollingerBands.yScale = function(x) {
        if (!arguments.length) {
            return yScale;
        }
        yScale = x;
        return bollingerBands;
    };
    bollingerBands.xValue = function(x) {
        if (!arguments.length) {
            return xValue;
        }
        xValue = x;
        return bollingerBands;
    };
    bollingerBands.yValue = function(x) {
        if (!arguments.length) {
            return yValue;
        }
        yValue = x;
        return bollingerBands;
    };
    bollingerBands.root = function(x) {
        if (!arguments.length) {
            return root;
        }
        root = x;
        return bollingerBands;
    };
    bollingerBands.decorate = function(x) {
        if (!arguments.length) {
            return decorate;
        }
        decorate = x;
        return bollingerBands;
    };

    return bollingerBands;
}
