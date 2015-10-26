import d3 from 'd3';
import annotationLine from '../../annotation/line';
import _multi from '../../series/multi';
import {noop} from '../../util/fn';
import seriesLine from '../../series/line';

export default function () {

    var xScale = d3.time.scale(),
        yScale = d3.scale.linear(),
        multiSeries = _multi(),
        decorate = noop;

    var annotations = annotationLine();

    var forceLine = seriesLine()
        .yValue(function (d, i) {
            return d.force;
        });

    var force = function (selection) {

        multiSeries.xScale(xScale)
            .yScale(yScale)
            .series([annotations, forceLine])
            .mapping(function (series) {
                if (series === annotations) {
                    return [
                        0
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

    force.xScale = function (x) {
        if (!arguments.length) {
            return xScale;
        }
        xScale = x;
        annotations.xScale(x);
        return force;
    };
    force.yScale = function (x) {
        if (!arguments.length) {
            return yScale;
        }
        yScale = x;
        annotations.yScale(x);
        return force;
    };
    force.decorate = function (x) {
        if (!arguments.length) {
            return decorate;
        }
        decorate = x;
        return force;
    };

    d3.rebind(force, forceLine, 'yValue', 'xValue');

    return force;
}
