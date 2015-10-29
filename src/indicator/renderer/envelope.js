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
        root = function(d) { return d.envelope; },
        decorate = noop;

    var area = _area()
        .y0Value(function(d, i) {
            return root(d).upperEnvelope;
        })
        .y1Value(function(d, i) {
            return root(d).lowerEnvelope;
        });

    var upperLine = _line()
        .yValue(function(d, i) {
            return root(d).upperEnvelope;
        });

    var lowerLine = _line()
        .yValue(function(d, i) {
            return root(d).lowerEnvelope;
        });

    var envelope = function(selection) {

        var multi = _multi()
            .xScale(xScale)
            .yScale(yScale)
            .series([area, upperLine, lowerLine])
            .decorate(function(g, data, index) {
                g.enter()
                    .attr('class', function(d, i) {
                        return 'multi envelope ' + ['area', 'upper', 'lower'][i];
                    });
                decorate(g, data, index);
            });

        area.xValue(xValue);
        upperLine.xValue(xValue);
        lowerLine.xValue(xValue);

        selection.call(multi);
    };

    envelope.xScale = function(x) {
        if (!arguments.length) {
            return xScale;
        }
        xScale = x;
        return envelope;
    };
    envelope.yScale = function(x) {
        if (!arguments.length) {
            return yScale;
        }
        yScale = x;
        return envelope;
    };
    envelope.xValue = function(x) {
        if (!arguments.length) {
            return xValue;
        }
        xValue = x;
        return envelope;
    };
    envelope.yValue = function(x) {
        if (!arguments.length) {
            return yValue;
        }
        yValue = x;
        return envelope;
    };
    envelope.root = function(x) {
        if (!arguments.length) {
            return root;
        }
        root = x;
        return envelope;
    };
    envelope.decorate = function(x) {
        if (!arguments.length) {
            return decorate;
        }
        decorate = x;
        return envelope;
    };

    return envelope;
}
