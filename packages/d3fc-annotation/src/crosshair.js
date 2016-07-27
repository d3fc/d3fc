import { scaleIdentity } from 'd3-scale';
import { select } from 'd3-selection';
import { dataJoin } from 'd3fc-data-join';
import { range } from './scale';
import { include, prefix, rebindAll } from 'd3fc-rebind';
import annotationLine from './line';
// XXX: waiting on d3fc-series
import { seriesMulti, seriesPoint } from 'd3fc-series';

export default function() {

    let x = (d) => d.x;
    let y = (d) => d.y;
    let xScale = scaleIdentity();
    let yScale = scaleIdentity();
    let decorate = () => {};

    const join = dataJoin('g', 'crosshair');

    const point = seriesPoint()
        .xValue(x)
        .yValue(y);

    const horizontalLine = annotationLine()
        .value(y)
        .label(y);

    const verticalLine = annotationLine()
        .orient('vertical')
        .value(x)
        .label(x);

    // The line annotations and point series used to render the crosshair are positioned using
    // screen coordinates. This function constructs an identity scale for these components.
    const xIdentity = scaleIdentity();
    const yIdentity = scaleIdentity();

    const multi = seriesMulti()
        .series([horizontalLine, verticalLine, seriesPoint])
        .xScale(xIdentity)
        .yScale(yIdentity)
        .mapping((series, index, data) => [data]);

    const instance = (selection) => {

        selection.each((data, index, nodes) => {

            const g = dataJoin(select(nodes[index]), data);

            // Prevent the crosshair triggering pointer events on itself
            g.enter()
                .style('pointer-events', 'none');

            // Assign the identity scales an accurate range to allow the line annotations to cover
            // the full width/height of the chart.
            xIdentity.range(range(xScale));
            yIdentity.range(range(yScale));

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
