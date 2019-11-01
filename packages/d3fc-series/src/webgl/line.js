import xyBase from '../xyBase';
import { glLine, scaleMapper, uniformBuilder } from '@d3fc/d3fc-webgl';
import { rebindAll, exclude, rebind } from '@d3fc/d3fc-rebind';

export default () => {
    const base = xyBase();
    let context = null;

    let draw = glLine();

    const line = (data) => {
        const xScale = scaleMapper(base.xScale());
        const yScale = scaleMapper(base.yScale());

        const accessor = getAccessors();

        const x = new Float32Array(data.length);
        const y = new Float32Array(data.length);

        data.forEach((d, i) => {
            x[i] = xScale.scale(accessor.x(d, i));
            y[i] = yScale.scale(accessor.y(d, i));
        });

        draw.xValues(x)
            .yValues(y)
            .xScale(xScale.glScale)
            .yScale(yScale.glScale)
            .decorate((program) => {
                program.buffers().uniform('uScreen', uniformBuilder([
                    program.context().canvas.width,
                    program.context().canvas.height
                ]));

                base.decorate()(program, data, 0);
            });

        const segments = getLineSegments(data);
        draw(0, segments);
    };

    function getAccessors() {
        if (base.orient() === 'vertical') {
            return {
                x: base.crossValue(),
                y: base.mainValue()
            };
        } else {
            return {
                x: base.mainValue(),
                y: base.crossValue()
            };
        }
    }

    // split the data into continuous segments of line
    // they'll each be drawn individually
    function getLineSegments(data) {
        const segments = [];

        let length = 0;
        let start = 0;
        data.forEach((d, i) => {
            if (line.defined()(d, i)) {
                if (length === 0) {
                    start = i;
                }
                length++;
            } else {
                if (length > 0) {
                    segments.push({
                        numElements: length,
                        start: start,
                        bufferSize: data.length
                    });
                    length = 0;
                }
            }
        });

        if (length > 0) {
            segments.push({
                numElements: length,
                start: start,
                bufferSize: data.length
            });
        }

        return segments;
    }

    line.context = (...args) => {
        if (!args.length) {
            return context;
        }
        context = args[0];
        return line;
    };

    rebindAll(line, base, exclude('baseValue', 'bandwidth', 'align'));
    rebind(line, draw, 'context');

    return line;
}
