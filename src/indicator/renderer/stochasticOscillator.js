import d3 from 'd3';
import annotationLine from '../../annotation/line';
import _multi from '../../series/multi';
import {noop} from '../../util/fn';
import seriesLine from '../../series/line';

export default function () {

    var xScale = d3.time.scale(),
        yScale = d3.scale.linear(),
        upperValue = 80,
        lowerValue = 20,
        multiSeries = _multi(),
        decorate = noop;

    var annotations = annotationLine();
    var dLine = seriesLine()
        .yValue(function (d, i) {
            return d.stochastic.d;
        });

    var kLine = seriesLine()
        .yValue(function (d, i) {
            return d.stochastic.k;
        });

    var stochastic = function (selection) {

        multiSeries.xScale(xScale)
            .yScale(yScale)
            .series([annotations, dLine, kLine])
            .mapping(function (series) {
                if (series === annotations) {
                    return [
                        upperValue,
                        lowerValue
                    ];
                }
                return this;
            })
            .decorate(function (g, data, index) {
                g.enter()
                    .attr('class', function (d, i) {
                        return 'multi ' + ['annotations', 'indicator'][i];
                    });
                decorate(g, data, index);
            });

        selection.call(multiSeries);
    };

    stochastic.xScale = function (x) {
        if (!arguments.length) {
            return xScale;
        }
        xScale = x;
        return stochastic;
    };
    stochastic.yScale = function (x) {
        if (!arguments.length) {
            return yScale;
        }
        yScale = x;
        return stochastic;
    };
    stochastic.upperValue = function (x) {
        if (!arguments.length) {
            return upperValue;
        }
        upperValue = x;
        return stochastic;
    };
    stochastic.lowerValue = function (x) {
        if (!arguments.length) {
            return lowerValue;
        }
        lowerValue = x;
        return stochastic;
    };
    stochastic.decorate = function (x) {
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
