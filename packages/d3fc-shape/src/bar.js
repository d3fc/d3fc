import { path } from 'd3-path';
import functor from './functor';

// Renders a bar series as an SVG path based on the given array of datapoints. Each
// bar has a fixed width, whilst the x, y and height are obtained from each data
// point via the supplied accessor functions.
export default () => {

    let context           = null;
    let x                 = (d) => d.x;
    let y                 = (d) => d.y;
    let horizontalAlign   = 'center';
    let verticalAlign     = 'center';
    let height            = (d) => d.height;
    let width             = functor(3);

    const bar = function(data, index) {

        const buffer = context ? undefined : context = path();

        data.forEach(function(d, i) {
            const xValue    = x.call(this, d, index || i);
            const yValue    = y.call(this, d, index || i);
            const barHeight = height.call(this, d, index || i);
            const barWidth  = width.call(this, d, index || i);

            let horizontalOffset;
            switch (horizontalAlign) {
            case 'left':
                horizontalOffset = barWidth;
                break;
            case 'right':
                horizontalOffset = 0;
                break;
            case 'center':
                horizontalOffset = barWidth / 2;
                break;
            default:
                throw new Error('Invalid horizontal alignment ' + horizontalAlign);
            }

            let verticalOffset;
            switch (verticalAlign) {
            case 'bottom':
                verticalOffset = -barHeight;
                break;
            case 'top':
                verticalOffset = 0;
                break;
            case 'center':
                verticalOffset = barHeight / 2;
                break;
            default:
                throw new Error('Invalid vertical alignment ' + verticalAlign);
            }

            context.rect(
                xValue - horizontalOffset,
                yValue - verticalOffset,
                barWidth,
                barHeight
            );
        }, this);

        return buffer && (context = null, buffer.toString() || null);
    };

    bar.context = (_x) => {
        if (!arguments.length) {
            return context;
        }
        context = _x;
        return bar;
    };
    bar.x = (_x) => {
        if (!arguments.length) {
            return x;
        }
        x = functor(_x);
        return bar;
    };
    bar.y = (_x) => {
        if (!arguments.length) {
            return y;
        }
        y = functor(_x);
        return bar;
    };
    bar.width = (_x) => {
        if (!arguments.length) {
            return width;
        }
        width = functor(_x);
        return bar;
    };
    bar.horizontalAlign = (_x) => {
        if (!arguments.length) {
            return horizontalAlign;
        }
        horizontalAlign = _x;
        return bar;
    };
    bar.height = (_x) => {
        if (!arguments.length) {
            return height;
        }
        height = functor(_x);
        return bar;
    };
    bar.verticalAlign = (_x) => {
        if (!arguments.length) {
            return verticalAlign;
        }
        verticalAlign = _x;
        return bar;
    };

    return bar;
};
