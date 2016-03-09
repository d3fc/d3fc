import { path } from 'd3-path';
import functor from './functor';

// Renders a box plot series as an SVG path based on the given array of datapoints.
export default () => {

    let context       = null;
    let value         = (d) => d.value;
    let median        = (d) => d.median;
    let upperQuartile = (d) => d.upperQuartile;
    let lowerQuartile = (d) => d.lowerQuartile;
    let high          = (d) => d.high;
    let low           = (d) => d.low;
    let orient        = 'vertical';
    let width         = functor(5);
    let cap           = functor(0.5);

    const boxPlot = function(data) {

        const buffer = context ? undefined : context = path();

        data.forEach(function(d, i) {
            // naming convention is for vertical orientation
            const _value          = value(d, i);
            const _width          = width(d, i);
            const halfWidth       = _width / 2;
            const capWidth        = _width * cap(d, i);
            const halfCapWidth    = capWidth / 2;
            const _high           = high(d, i);
            const _upperQuartile  = upperQuartile(d, i);
            const _median         = median(d, i);
            const _lowerQuartile  = lowerQuartile(d, i);
            const _low            = low(d, i);
            const upperQuartileToLowerQuartile = _lowerQuartile - _upperQuartile;

            if (orient === 'vertical') {
                // Upper whisker
                context.moveTo(_value - halfCapWidth, _high);
                context.lineTo(_value + halfCapWidth, _high);
                context.moveTo(_value, _high);
                context.lineTo(_value, _upperQuartile);

                // Box
                context.rect(_value - halfWidth, _upperQuartile, _width, upperQuartileToLowerQuartile);
                context.moveTo(_value - halfWidth, _median);
                // Median line
                context.lineTo(_value + halfWidth, _median);

                // Lower whisker
                context.moveTo(_value, _lowerQuartile);
                context.lineTo(_value, _low);
                context.moveTo(_value - halfCapWidth, _low);
                context.lineTo(_value + halfCapWidth, _low);
            } else {
                // Lower whisker
                context.moveTo(_low, _value - halfCapWidth);
                context.lineTo(_low, _value + halfCapWidth);
                context.moveTo(_low, _value);
                context.lineTo(_lowerQuartile, _value);

                // Box
                context.rect(_lowerQuartile, _value - halfWidth, -upperQuartileToLowerQuartile, _width);
                context.moveTo(_median, _value - halfWidth);
                context.lineTo(_median, _value + halfWidth);

                // Upper whisker
                context.moveTo(_upperQuartile, _value);
                context.lineTo(_high, _value);
                context.moveTo(_high, _value - halfCapWidth);
                context.lineTo(_high, _value + halfCapWidth);
            }
        });

        return buffer && (context = null, buffer.toString()  || null);
    };

    boxPlot.context = (_x) => {
        if (!arguments.length) {
            return context;
        }
        context = _x;
        return boxPlot;
    };
    boxPlot.value = (_x) => {
        if (!arguments.length) {
            return value;
        }
        value = functor(_x);
        return boxPlot;
    };
    boxPlot.median = (_x) => {
        if (!arguments.length) {
            return median;
        }
        median = functor(_x);
        return boxPlot;
    };
    boxPlot.upperQuartile = (_x) => {
        if (!arguments.length) {
            return upperQuartile;
        }
        upperQuartile = functor(_x);
        return boxPlot;
    };
    boxPlot.lowerQuartile = (_x) => {
        if (!arguments.length) {
            return lowerQuartile;
        }
        lowerQuartile = functor(_x);
        return boxPlot;
    };
    boxPlot.high = (_x) => {
        if (!arguments.length) {
            return high;
        }
        high = functor(_x);
        return boxPlot;
    };
    boxPlot.low = (_x) => {
        if (!arguments.length) {
            return low;
        }
        low = functor(_x);
        return boxPlot;
    };
    boxPlot.width = (_x) => {
        if (!arguments.length) {
            return width;
        }
        width = functor(_x);
        return boxPlot;
    };
    boxPlot.orient = (_x) => {
        if (!arguments.length) {
            return orient;
        }
        orient = _x;
        return boxPlot;
    };
    boxPlot.cap = (_x) => {
        if (!arguments.length) {
            return cap;
        }
        cap = functor(_x);
        return boxPlot;
    };

    return boxPlot;
};
