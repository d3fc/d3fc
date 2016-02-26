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
        filter = identity,
        component = noop;

    var dataJoin = dataJoinUtil()
        .selector('g.rectangle')
        .element('g')
        .attr('class', 'rectangle');

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
            // obtain the rectangular bounding boxes for each child
            var childRects = data.map(function(d, i) {
                var childPos = position(d, i);
                var childSize = size(d, i);
                return {
                    x: childPos[0],
                    y: childPos[1],
                    width: childSize[0],
                    height: childSize[1]
                };
            });

            // apply the strategy to derive the layout. The strategy does not change the order
            // or number of rectangles.
            var layout = strategy(childRects);

            // add indices to the layouts
            layout.forEach(function(d, i) { d.dataIndex = i; });

            // apply filter algorithm
            var filteredLayout = filter(layout);

            // filter the data to include only those remaining after collision removal
            var filteredData = filteredLayout.map(function(d) { return data[d.dataIndex]; });

            var g = dataJoin(this, filteredData);

            // offset each rectangle accordingly
            g.attr('transform', function(d, i) {
                var offset = filteredLayout[i];
                return 'translate(' + offset.x + ', ' + offset.y + ')';
            });

            // set the layout width / height so that children can use SVG layout if required
            g.attr({
                'layout-width': function(d, i) { return filteredLayout[i].width; },
                'layout-height': function(d, i) { return filteredLayout[i].height; }
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

    rectangles.filter = function(value) {
        if (!arguments.length) {
            return filter;
        }
        filter = value;
        return rectangles;
    };
    return rectangles;
}
