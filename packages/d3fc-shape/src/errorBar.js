import { path } from 'd3-path';
import functor from './functor';

// Renders an error bar series as an SVG path based on the given array of datapoints.
export default () => {

    let context   = null;
    let value     = (d) => d.x;
    let high      = (d) => d.high;
    let low       = (d) => d.low;
    let orient    = 'vertical';
    let width     = functor(5);

    const errorBar = function(data) {

        const buffer = context ? undefined : context = path();

        data.forEach(function(d, i) {
            // naming convention is for vertical orientation
            const _value      = value(d, i);
            const _width      = width(d, i);
            const halfWidth   = _width / 2;
            const _high       = high(d, i);
            const _low        = low(d, i);

            if (orient === 'vertical') {
                context.moveTo(_value - halfWidth, _high);
                context.lineTo(_value + halfWidth, _high);
                context.moveTo(_value, _high);
                context.lineTo(_value, _low);
                context.moveTo(_value - halfWidth, _low);
                context.lineTo(_value + halfWidth, _low);
            } else {
                context.moveTo(_low, _value - halfWidth);
                context.lineTo(_low, _value + halfWidth);
                context.moveTo(_low, _value);
                context.lineTo(_high, _value);
                context.moveTo(_high, _value - halfWidth);
                context.lineTo(_high, _value + halfWidth);
            }
        });

        return buffer && (context = null, buffer.toString() || null);
    };

    errorBar.context = (_x) => {
        if (!arguments.length) {
            return context;
        }
        context = _x;
        return errorBar;
    };
    errorBar.value = (_x) => {
        if (!arguments.length) {
            return value;
        }
        value = functor(_x);
        return errorBar;
    };
    errorBar.high = (_x) => {
        if (!arguments.length) {
            return high;
        }
        high = functor(_x);
        return errorBar;
    };
    errorBar.low = (_x) => {
        if (!arguments.length) {
            return low;
        }
        low = functor(_x);
        return errorBar;
    };
    errorBar.width = (_x) => {
        if (!arguments.length) {
            return width;
        }
        width = functor(_x);
        return errorBar;
    };
    errorBar.orient = (_x) => {
        if (!arguments.length) {
            return orient;
        }
        orient = _x;
        return errorBar;
    };

    return errorBar;
};
