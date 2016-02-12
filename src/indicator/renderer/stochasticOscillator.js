import d3 from 'd3';
import lineAnnotation from '../../annotation/line';
import multiSeries from '../../series/multi';
import {noop} from '../../util/fn';
import lineSeries from '../../series/line';

export default function() {

    var xScale = d3.time.scale(),
        yScale = d3.scale.linear(),
        upperValue = 80,
        lowerValue = 20,
        multi = multiSeries(),
        decorate = noop;

    var annotations = lineAnnotation();
    var dLine = lineSeries()
        .xValue(function(d, i) { return d.date; })
        .yValue(function(d, i) { return d.stochastic.d; });

    var kLine = lineSeries()
        .yValue(function(d, i) {
            return d.stochastic.k;
        });

    var stochastic = function(selection) {

        multi.xScale(xScale)
            .yScale(yScale)
            .series([annotations, dLine, kLine])
            .mapping(function(series) {
                if (series === annotations) {
                    return [
                        upperValue,
                        lowerValue
                    ];
                }
                return this;
            })
            .decorate(function(g, data, index) {
                g.enter()
                    .attr('class', function(d, i) {
                        return 'multi stochastic ' + ['annotations', 'stochastic-d', 'stochastic-k'][i];
                    });
                decorate(g, data, index);
            });

        selection.call(multi);
    };

    stochastic.xScale = function(x) {
        if (!arguments.length) {
            return xScale;
        }
        xScale = x;
        return stochastic;
    };
    stochastic.yScale = function(x) {
        if (!arguments.length) {
            return yScale;
        }
        yScale = x;
        return stochastic;
    };
    stochastic.upperValue = function(x) {
        if (!arguments.length) {
            return upperValue;
        }
        upperValue = x;
        return stochastic;
    };
    stochastic.lowerValue = function(x) {
        if (!arguments.length) {
            return lowerValue;
        }
        lowerValue = x;
        return stochastic;
    };
    stochastic.decorate = function(x) {
        if (!arguments.length) {
            return decorate;
        }
        decorate = x;
        return stochastic;
    };

    d3.rebind(stochastic, dLine, 'yDValue', 'xDValue');

    d3.rebind(stochastic, kLine, 'yKValue', 'xKValue');

    return stochastic;
}
