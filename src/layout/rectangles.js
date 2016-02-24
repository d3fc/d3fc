import d3 from 'd3';
import dataJoinUtil from '../util/dataJoin';
import {noop, identity} from '../util/fn';
import {range} from '../util/scale';
import {rebindAll} from '../util/rebind';

export default function(layoutStrategy) {

    var size = d3.functor([0, 0]),
        position = function(d, i) { return [d.x, d.y]; };

    var xScale = d3.scale.identity(),
        yScale = d3.scale.identity(),
        strategy = layoutStrategy || identity,
        component = noop,
        coords = 'screen';

    var dataJoin = dataJoinUtil()
        .selector('g.rectangle')
        .element('g')
        .attr('class', 'rectangle');

    function getPosition(d, i) {
        var pos = position(d, i);
        if (coords === 'domain') {
            pos[0] = xScale(pos[0]);
            pos[1] = yScale(pos[1]);
        }
        return pos;
    }
    var rectangles = function(selection) {

        var xRange = range(xScale),
            yRange = range(yScale);

        if (strategy.bounds && xScale && yScale) {
            strategy.bounds([
                Math.max(xRange[0], xRange[1]),
                Math.max(yRange[0], yRange[1])
            ]);
        }

        selection.each(function(data, index) {
            var g = dataJoin(this, data);

            // obtain the rectangular bounding boxes for each child
            var childRects = data.map(function(d, i) {
                var childPos = getPosition(d, i);
                var childSize = size(d, i);
                return {
                    x: childPos[0],
                    y: childPos[1],
                    width: childSize[0],
                    height: childSize[1]
                };
            });

            // apply the strategy to derive the layout
            var layout = strategy(childRects);

            // offset each rectangle accordingly
            g.attr('transform', function(d, i) {
                var offset = layout[i];
                return 'translate(' + offset.x + ', ' + offset.y + ')';
            });

            // set the layout width / height so that children can use SVG layout if required
            g.attr({
                'layout-width': function(d, i) { return childRects[i].width; },
                'layout-height': function(d, i) { return childRects[i].height; }
            });

            g.call(component);
        });
    };

    rebindAll(rectangles, strategy);

    rectangles.size = function(x) {
        if (!arguments.length) {
            return size;
        }
        size = d3.functor(x);
        return rectangles;
    };

    rectangles.position = function(x) {
        if (!arguments.length) {
            return position;
        }
        position = d3.functor(x);
        return rectangles;
    };

    rectangles.xScale = function(value) {
        if (!arguments.length) {
            return xScale;
        }
        xScale = value;
        return rectangles;
    };

    rectangles.yScale = function(value) {
        if (!arguments.length) {
            return yScale;
        }
        yScale = value;
        return rectangles;
    };

    rectangles.component = function(value) {
        if (!arguments.length) {
            return component;
        }
        component = value;
        return rectangles;
    };

    rectangles.coords = function(value) {
        if (!arguments.length) {
            return coords;
        }
        coords = value;
        return rectangles;
    };

    return rectangles;
}
