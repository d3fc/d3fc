import xyBase from '../xyBase';
import isIdentityScale from '../isIdentityScale';
import { glLine, scaleMapper } from '@d3fc/d3fc-webgl';
import { rebindAll, exclude, rebind } from '@d3fc/d3fc-rebind';

export default () => {
    const base = xyBase();

    const draw = glLine();

    let equals = (previousData, data) => false;
    let previousData = [];

    const line = (data) => {
        if (base.orient() !== 'vertical') {
            throw new Error(`Unsupported orientation ${base.orient()}`);
        }

        const xScale = scaleMapper(base.xScale());
        const yScale = scaleMapper(base.yScale());

        if (!isIdentityScale(xScale.scale) || !isIdentityScale(yScale.scale) || !equals(previousData, data)) {
            previousData = data;

            const accessor = getAccessors();

            const x = new Float32Array(data.length);
            const y = new Float32Array(data.length);
            const defined = new Float32Array(data.length);

            data.forEach((d, i) => {
                x[i] = xScale.scale(accessor.x(d, i));
                y[i] = yScale.scale(accessor.y(d, i));
                defined[i] = accessor.defined(d, i);
            });

            draw.xValues(x)
                .yValues(y)
                .defined(defined);
        }

        draw.xScale(xScale.glScale)
            .yScale(yScale.glScale)
            .decorate((program) => {
                base.decorate()(program, data, 0);
            });

        draw(data.length);
    };

    function getAccessors() {
        if (base.orient() === 'vertical') {
            return {
                x: base.crossValue(),
                y: base.mainValue(),
                defined: base.defined()
            };
        } else {
            return {
                x: base.mainValue(),
                y: base.crossValue(),
                defined: base.defined()
            };
        }
    }

    line.equals = (...args) => {
        if (!args.length) {
            return equals;
        }
        equals = args[0];
        return line;
    };

    rebindAll(line, base, exclude('baseValue', 'bandwidth', 'align'));
    rebind(line, draw, 'context', 'lineWidth');

    return line;
};
