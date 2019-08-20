import xyBase from '../xyBase';
import { glLine, scaleMapper } from '@d3fc/d3fc-webgl';
import { rebindAll, exclude, rebind } from '@d3fc/d3fc-rebind';

export default () => {
    const base = xyBase();
    let context = null;

    let draw = glLine();

    const line = (data) => {
        const xScale = scaleMapper(base.xScale());
        const yScale = scaleMapper(base.yScale());

        const accessor = getAccessors();

        const lines = getLines(data);
        lines.forEach(l => {
            const x = new Float32Array(l.length);
            const y = new Float32Array(l.length);

            l.forEach((dataPoint, i) => {
                x[i] = xScale.scale(accessor.x(dataPoint.d, dataPoint.i));
                y[i] = yScale.scale(accessor.y(dataPoint.d, dataPoint.i));
            });

            draw.xValues(x)
                .yValues(y)
                .xScale(xScale.glScale)
                .yScale(yScale.glScale)
                .decorate((program) => base.decorate()(program, l.map(v => v.d), 0));

            draw(l.length);
        });
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
    function getLines(data) {
        const lines = [];

        let currentLine = [];
        data.forEach((d, i) => {
            if (line.defined()(d, i)) {
                currentLine.push({ d, i });
            } else {
                if (currentLine.length) {
                    lines.push(currentLine);
                    currentLine = [];
                }
            }
        });
        if (currentLine.length) {
            lines.push(currentLine);
        }

        return lines;
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