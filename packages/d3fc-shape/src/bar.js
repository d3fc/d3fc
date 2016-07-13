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

        const drawingContext = context || path();

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

            drawingContext.rect(
                xValue - horizontalOffset,
                yValue - verticalOffset,
                barWidth,
                barHeight
            );
        }, this);

        return context ? null : drawingContext.toString();
    };

    bar.context = (...args) => {
        if (!args.length) {
            return context;
        }
        context = args[0];
        return bar;
    };
    bar.x = (...args) => {
        if (!args.length) {
            return x;
        }
        x = functor(args[0]);
        return bar;
    };
    bar.y = (...args) => {
        if (!args.length) {
            return y;
        }
        y = functor(args[0]);
        return bar;
    };
    bar.width = (...args) => {
        if (!args.length) {
            return width;
        }
        width = functor(args[0]);
        return bar;
    };
    bar.horizontalAlign = (...args) => {
        if (!args.length) {
            return horizontalAlign;
        }
        horizontalAlign = args[0];
        return bar;
    };
    bar.height = (...args) => {
        if (!args.length) {
            return height;
        }
        height = functor(args[0]);
        return bar;
    };
    bar.verticalAlign = (...args) => {
        if (!args.length) {
            return verticalAlign;
        }
        verticalAlign = args[0];
        return bar;
    };

    return bar;
};
