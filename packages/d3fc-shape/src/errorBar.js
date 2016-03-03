import functor from './functor';

// Renders an error bar series as an SVG path based on the given array of datapoints.
export default (context) => {

    let value     = (d) => d.x;
    let high      = (d) => d.high;
    let low       = (d) => d.low;
    let orient    = 'vertical';
    let width     = functor(5);

    const errorBar = (data) => {
        const path = context();

        data.forEach((d, i) => {
            // naming convention is for vertical orientation
            const _value      = value(d, i);
            const _width      = width(d, i);
            const halfWidth   = _width / 2;
            const _high       = high(d, i);
            const _low        = low(d, i);

            if (orient === 'vertical') {
                path.moveTo(_value - halfWidth, _high);
                path.lineTo(_value + halfWidth, _high);
                path.moveTo(_value, _high);
                path.lineTo(_value, _low);
                path.moveTo(_value - halfWidth, _low);
                path.lineTo(_value + halfWidth, _low);
            } else {
                path.moveTo(_low, _value - halfWidth);
                path.lineTo(_low, _value + halfWidth);
                path.moveTo(_low, _value);
                path.lineTo(_high, _value);
                path.moveTo(_high, _value - halfWidth);
                path.lineTo(_high, _value + halfWidth);
            }
        });

        return path.toString();
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
