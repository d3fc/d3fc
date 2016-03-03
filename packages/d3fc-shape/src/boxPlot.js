import functor from './functor';

// Renders a box plot series as an SVG path based on the given array of datapoints.
export default (context) => {

    let value         = (d) => d.value;
    let median        = (d) => d.median;
    let upperQuartile = (d) => d.upperQuartile;
    let lowerQuartile = (d) => d.lowerQuartile;
    let high          = (d) => d.high;
    let low           = (d) => d.low;
    let orient        = 'vertical';
    let width         = functor(5);
    let cap           = functor(0.5);

    const boxPlot = (data) => {
        const path = context();

        data.forEach((d, i) => {
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
                path.moveTo(_value - halfCapWidth, _high);
                path.lineTo(_value + halfCapWidth, _high);
                path.moveTo(_value, _high);
                path.lineTo(_value, _upperQuartile);

                // Box
                path.rect(_value - halfWidth, _upperQuartile, _width, upperQuartileToLowerQuartile);
                path.moveTo(_value - halfWidth, _median);
                // Median line
                path.lineTo(_value + halfWidth, _median);

                // Lower whisker
                path.moveTo(_value, _lowerQuartile);
                path.lineTo(_value, _low);
                path.moveTo(_value - halfCapWidth, _low);
                path.lineTo(_value + halfCapWidth, _low);
            } else {
                // Lower whisker
                path.moveTo(_low, _value - halfCapWidth);
                path.lineTo(_low, _value + halfCapWidth);
                path.moveTo(_low, _value);
                path.lineTo(_lowerQuartile, _value);

                // Box
                path.rect(_lowerQuartile, _value - halfWidth, -upperQuartileToLowerQuartile, _width);
                path.moveTo(_median, _value - halfWidth);
                path.lineTo(_median, _value + halfWidth);

                // Upper whisker
                path.moveTo(_upperQuartile, _value);
                path.lineTo(_high, _value);
                path.moveTo(_high, _value - halfCapWidth);
                path.lineTo(_high, _value + halfCapWidth);
            }
        });

        return path.toString();
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
