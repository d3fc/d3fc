import d3 from 'd3';
import dataJoinUtil from '../util/dataJoin';
import {noop} from '../util/fn';
import {range} from '../util/scale';
import noopStrategy from './strategy/noop';
import {rebindAll} from '../util/rebind';

export default function(layoutStrategy) {

    var width = d3.functor(0),
        height = d3.functor(0),
        x = function(d, i) { return d.x; },
        y = function(d, i) { return d.y; };

    var xScale = d3.scale.identity(),
        yScale = d3.scale.identity(),
        strategy = layoutStrategy || noopStrategy(),
        component = noop;

    var dataJoin = dataJoinUtil()
        .selector('g.rectangle')
        .element('g')
        .attr('class', 'rectangle');

    var rectangles = function(selection) {

        var xRange = range(xScale),
            yRange = range(yScale);
        strategy.containerWidth(Math.max(xRange[0], xRange[1]))
            .containerHeight(Math.max(yRange[0], yRange[1]));

        selection.each(function(data, index) {
            var g = dataJoin(this, data);

            // obtain the rectangular bounding boxes for each child
            var childRects = data.map(function(d, i) {
                return {
                    x: x(d, i),
                    y: y(d, i),
                    width: width(d, i),
                    height: height(d, i)
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
            g.attr('layout-width', function(d, i) { return childRects[i].width; });
            g.attr('layout-height', function(d, i) { return childRects[i].height; });

            g.call(component);
        });
    };

    rebindAll(rectangles, strategy);

    rectangles.x = function(value) {
        if (!arguments.length) {
            return x;
        }
        x = d3.functor(value);
        return rectangles;
    };

    rectangles.y = function(value) {
        if (!arguments.length) {
            return y;
        }
        y = d3.functor(value);
        return rectangles;
    };

    rectangles.width = function(value) {
        if (!arguments.length) {
            return width;
        }
        width = d3.functor(value);
        return rectangles;
    };

    rectangles.height = function(value) {
        if (!arguments.length) {
            return height;
        }
        height = d3.functor(value);
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

    return rectangles;
}
