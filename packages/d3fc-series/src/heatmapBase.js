import { scaleIdentity, interpolateViridis, scaleLinear } from 'd3-scale';
import { min, max } from 'd3-array';
import { rebindAll, includeMap, rebind } from 'd3fc-rebind';
import { shapeBar } from 'd3fc-shape';
import functor from './functor';
import defined from './defined';

export default () => {

    let xValue = (d) => d.x;
    let yValue = (d) => d.y;
    let colorValue = (d) => d.color;
    let xScale = scaleIdentity();
    let yScale = scaleIdentity();
    let yBandwidth = () => 5;
    let xBandwidth = () => 5;
    let colorInterpolate = interpolateViridis;
    let decorate = () => {};

    const heatmap = () => {};

    heatmap.defined = (d, i) => defined(xValue, yValue, colorValue)(d, i);

    heatmap.pathGenerator = shapeBar()
        .x(0)
        .y(0);

    heatmap.colorScale = (data) => {
        const colorValues = data.map(colorValue);
        // a scale that maps the color values onto a unit range, [0, 1]
        return scaleLinear()
          .domain([min(colorValues), max(colorValues)]);
    };

    heatmap.values = (d, i) => ({
        x: xScale(xValue(d, i)),
        y: yScale(yValue(d, i)),
        colorValue: colorValue(d, i),
        width: xBandwidth(d, i),
        height: yBandwidth(d, i)
    });

    heatmap.xValue = (...args) => {
        if (!args.length) {
            return xValue;
        }
        xValue = functor(args[0]);
        return heatmap;
    };
    heatmap.yValue = (...args) => {
        if (!args.length) {
            return yValue;
        }
        yValue = functor(args[0]);
        return heatmap;
    };
    heatmap.colorValue = (...args) => {
        if (!args.length) {
            return colorValue;
        }
        colorValue = functor(args[0]);
        return heatmap;
    };
    heatmap.colorInterpolate = (...args) => {
        if (!args.length) {
            return colorInterpolate;
        }
        colorInterpolate = args[0];
        return heatmap;
    };
    heatmap.xScale = (...args) => {
        if (!args.length) {
            return xScale;
        }
        xScale = args[0];
        return heatmap;
    };
    heatmap.yScale = (...args) => {
        if (!args.length) {
            return yScale;
        }
        yScale = args[0];
        return heatmap;
    };
    heatmap.xBandwidth = (...args) => {
        if (!args.length) {
            return xBandwidth;
        }
        xBandwidth = functor(args[0]);
        return heatmap;
    };
    heatmap.yBandwidth = (...args) => {
        if (!args.length) {
            return yBandwidth;
        }
        yBandwidth = functor(args[0]);
        return heatmap;
    };
    heatmap.decorate = (...args) => {
        if (!args.length) {
            return decorate;
        }
        decorate = args[0];
        return heatmap;
    };

    rebindAll(heatmap, heatmap.pathGenerator, includeMap({
        'horizontalAlign': 'xAlign',
        'verticalAlign': 'yAlign'
    }));

    return heatmap;
};
