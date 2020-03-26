import { scaleIdentity, scaleLinear } from 'd3-scale';
import { interpolateViridis } from 'd3-scale-chromatic';
import { min, max } from 'd3-array';
import { rebindAll, includeMap } from '@d3fc/d3fc-rebind';
import { shapeBar } from '@d3fc/d3fc-shape';
import functor from './functor';
import defined from './defined';
import createBase from './base';

export default () => {

    let xValue = (d) => d.x;
    let yValue = (d) => d.y;
    let colorValue = (d) => d.color;
    let yBandwidth = () => 5;
    let xBandwidth = () => 5;
    let colorInterpolate = interpolateViridis;

    const heatmap = createBase({
        decorate: () => {},
        defined: (d, i) => defined(xValue, yValue, colorValue)(d, i),
        xScale: scaleIdentity(),
        yScale: scaleIdentity()
    });

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
        x: heatmap.xScale()(xValue(d, i)),
        y: heatmap.yScale()(yValue(d, i)),
        colorValue: colorValue(d, i),
        width: xBandwidth(d, i),
        height: yBandwidth(d, i)
    });


    heatmap.xValues = () => [xValue];
    heatmap.yValues = () => [yValue];
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

    rebindAll(heatmap, heatmap.pathGenerator, includeMap({
        'horizontalAlign': 'xAlign',
        'verticalAlign': 'yAlign'
    }));

    return heatmap;
};
