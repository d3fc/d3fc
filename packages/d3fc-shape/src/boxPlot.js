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

        const drawingContext = context || path();

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
                drawingContext.moveTo(_value - halfCapWidth, _high);
                drawingContext.lineTo(_value + halfCapWidth, _high);
                drawingContext.moveTo(_value, _high);
                drawingContext.lineTo(_value, _upperQuartile);

                // Box
                drawingContext.rect(_value - halfWidth, _upperQuartile, _width, upperQuartileToLowerQuartile);
                drawingContext.moveTo(_value - halfWidth, _median);
                // Median line
                drawingContext.lineTo(_value + halfWidth, _median);

                // Lower whisker
                drawingContext.moveTo(_value, _lowerQuartile);
                drawingContext.lineTo(_value, _low);
                drawingContext.moveTo(_value - halfCapWidth, _low);
                drawingContext.lineTo(_value + halfCapWidth, _low);
            } else {
                // Lower whisker
                drawingContext.moveTo(_low, _value - halfCapWidth);
                drawingContext.lineTo(_low, _value + halfCapWidth);
                drawingContext.moveTo(_low, _value);
                drawingContext.lineTo(_lowerQuartile, _value);

                // Box
                drawingContext.rect(_lowerQuartile, _value - halfWidth, -upperQuartileToLowerQuartile, _width);
                drawingContext.moveTo(_median, _value - halfWidth);
                drawingContext.lineTo(_median, _value + halfWidth);

                // Upper whisker
                drawingContext.moveTo(_upperQuartile, _value);
                drawingContext.lineTo(_high, _value);
                drawingContext.moveTo(_high, _value - halfCapWidth);
                drawingContext.lineTo(_high, _value + halfCapWidth);
            }
        });

        return context ? null : drawingContext.toString();
    };

    boxPlot.context = (...args) => {
        if (!args.length) {
            return context;
        }
        context = args[0];
        return boxPlot;
    };
    boxPlot.value = (...args) => {
        if (!args.length) {
            return value;
        }
        value = functor(args[0]);
        return boxPlot;
    };
    boxPlot.median = (...args) => {
        if (!args.length) {
            return median;
        }
        median = functor(args[0]);
        return boxPlot;
    };
    boxPlot.upperQuartile = (...args) => {
        if (!args.length) {
            return upperQuartile;
        }
        upperQuartile = functor(args[0]);
        return boxPlot;
    };
    boxPlot.lowerQuartile = (...args) => {
        if (!args.length) {
            return lowerQuartile;
        }
        lowerQuartile = functor(args[0]);
        return boxPlot;
    };
    boxPlot.high = (...args) => {
        if (!args.length) {
            return high;
        }
        high = functor(args[0]);
        return boxPlot;
    };
    boxPlot.low = (...args) => {
        if (!args.length) {
            return low;
        }
        low = functor(args[0]);
        return boxPlot;
    };
    boxPlot.width = (...args) => {
        if (!args.length) {
            return width;
        }
        width = functor(args[0]);
        return boxPlot;
    };
    boxPlot.orient = (...args) => {
        if (!args.length) {
            return orient;
        }
        orient = args[0];
        return boxPlot;
    };
    boxPlot.cap = (...args) => {
        if (!args.length) {
            return cap;
        }
        cap = functor(args[0]);
        return boxPlot;
    };

    return boxPlot;
};
