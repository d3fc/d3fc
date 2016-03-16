import d3 from 'd3';
import { range } from '../util/scale';
import { rebindAll } from 'd3fc-rebind';
import { label as labelLayout } from 'd3fc-label-layout';

export default function(strategy) {

    var adaptee = labelLayout(strategy);

    var xScale = d3.scale.identity(),
        yScale = d3.scale.identity();

    var label = function(selection) {
        // automatically set the bounds of the strategy based on the scale range
        if (strategy && strategy.bounds) {
            var xRange = range(xScale),
                yRange = range(yScale);
            strategy.bounds([
                Math.max(xRange[0], xRange[1]),
                Math.max(yRange[0], yRange[1])
            ]);
        }

        selection.call(adaptee);
    };

    rebindAll(label, adaptee);

    label.xScale = function(value) {
        if (!arguments.length) {
            return xScale;
        }
        xScale = value;
        return label;
    };

    label.yScale = function(value) {
        if (!arguments.length) {
            return yScale;
        }
        yScale = value;
        return label;
    };

    return label;
}
