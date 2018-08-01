import { scaleIdentity } from 'd3-scale';
import { select } from 'd3-selection';
import { dataJoin } from '@d3fc/d3fc-data-join';
import { include, prefix, rebindAll } from '@d3fc/d3fc-rebind';
import annotationLine from './line';
import { seriesSvgMulti, seriesSvgPoint } from '@d3fc/d3fc-series';

export default function() {

    let x = (d) => d.x;
    let y = (d) => d.y;
    let xScale = scaleIdentity();
    let yScale = scaleIdentity();
    let decorate = () => {};

    const join = dataJoin('g', 'annotation-crosshair');

    const point = seriesSvgPoint();

    const horizontalLine = annotationLine();

    const verticalLine = annotationLine()
        .orient('vertical');

    // The line annotations and point series used to render the crosshair are positioned using
    // screen coordinates. This function constructs an identity scale for these components.
    const xIdentity = scaleIdentity();
    const yIdentity = scaleIdentity();

    const multi = seriesSvgMulti()
        .series([horizontalLine, verticalLine, point])
        .xScale(xIdentity)
        .yScale(yIdentity)
        .mapping((data) => [data]);

    const instance = (selection) => {

        if (selection.selection) {
            join.transition(selection);
        }

        selection.each((data, index, nodes) => {

            const g = join(select(nodes[index]), data);

            // Prevent the crosshair triggering pointer events on itself
            g.enter()
                .style('pointer-events', 'none');

            // Assign the identity scales an accurate range to allow the line annotations to cover
            // the full width/height of the chart.
            xIdentity.range(xScale.range());
            yIdentity.range(yScale.range());

            point.crossValue(x)
                .mainValue(y);

            horizontalLine.value(y);

            verticalLine.value(x);

            g.call(multi);

            decorate(g, data, index);
        });
    };

    // Don't use the xValue/yValue convention to indicate that these values are in screen
    // not domain co-ordinates and are therefore not scaled.
    instance.x = (...args) => {
        if (!args.length) {
            return x;
        }
        x = args[0];
        return instance;
    };
    instance.y = (...args) => {
        if (!args.length) {
            return y;
        }
        y = args[0];
        return instance;
    };
    instance.xScale = (...args) => {
        if (!args.length) {
            return xScale;
        }
        xScale = args[0];
        return instance;
    };
    instance.yScale = (...args) => {
        if (!args.length) {
            return yScale;
        }
        yScale = args[0];
        return instance;
    };
    instance.decorate = (...args) => {
        if (!args.length) {
            return decorate;
        }
        decorate = args[0];
        return instance;
    };

    const lineIncludes = include('label');
    rebindAll(instance, horizontalLine, lineIncludes, prefix('y'));
    rebindAll(instance, verticalLine, lineIncludes, prefix('x'));

    return instance;
}
