import d3 from 'd3';
import {noop, identity} from '../util/fn';
import {rebindAll} from '../util/rebind';
import layoutRectangles from './rectangles';
import arrayFunctor from '../util/arrayFunctor';

export default function(layoutStrategy) {

    var origin = d3.functor([0, 0]),
        component = noop,
        decorate = noop,
        strategy = layoutStrategy || identity;

    var rectangles = layoutRectangles(strategy);

    var line = d3.svg.line()
        .x(function(d) { return d[0]; })
        .y(function(d) { return d[1]; });

    var callout = function(data) {
        var anchors = [];

        // Define the two rebindAll exclusions
        rectangles.anchor(function(i, x, y) {
            anchors[i] = [x, y];
        });

        rectangles.component(function(selection) {

            selection.append('path')
                .attr('class', 'callout-path')
                .attr('d', function(d, i) {
                    // Since the rectangle changes placement, offset
                    // that placement so the origin point is fixed
                    var pointOrigin = origin(d, i).map(function(value, dimension) {
                        return anchors[i][dimension] + value;
                    });
                    return line([anchors[i], pointOrigin]);
                });

            selection.append('rect')
                .attr('class', 'callout-label')
                .layout({
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0
                });

            decorate(selection);
            selection.layout();
        });

        rectangles.call(this, data);
    };

    rebindAll(callout, rectangles, '', ['anchor', 'component']);

    callout.origin = function(x) {
        if (!arguments.length) {
            return origin;
        }
        origin = x;
        return callout;
    };

    callout.decorate = function(x) {
        if (!arguments.length) {
            return decorate;
        }
        decorate = x;
        return callout;
    };

    return callout;
}
