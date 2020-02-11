import uniform from '../buffer/uniform';
import baseScale from './base';
import { rebindAll } from '@d3fc/d3fc-rebind';

export default () => {
    const base = baseScale();
    let exponent = 1;

    function pow(b, e) {
        return Math.sign(b) * Math.pow(Math.abs(b), e);
    }

    const prefix = component => `pow${component}`;

    const scale = (programBuilder, identifier, component) => {
        const powPart = `${prefix(component)}Offset + (${prefix(
            component
        )}Scale * sign(${identifier}) * pow(abs(${identifier}), vec4(${prefix(
            component
        )}Exp)))`;

        programBuilder
            .vertexShader()
            .appendHeaderIfNotExists(`uniform vec4 ${prefix(component)}Offset;`)
            .appendHeaderIfNotExists(`uniform vec4 ${prefix(component)}Scale;`)
            .appendHeaderIfNotExists(
                `uniform vec4 ${prefix(component)}Include;`
            )
            .appendHeaderIfNotExists(`uniform float ${prefix(component)}Exp;`)
            .appendBody(
                `${identifier} = (${prefix(
                    component
                )}Include * (${powPart})) + ((1.0 - ${prefix(
                    component
                )}Include) * ${identifier});`
            );

        const domainSize =
            pow(base.domain()[1], exponent) - pow(base.domain()[0], exponent);
        const rangeSize = base.range()[1] - base.range()[0];

        const scaleFactor = rangeSize / domainSize;
        const translate =
            base.range()[0] - scaleFactor * pow(base.domain()[0], exponent);

        const offset = [0, 0, 0, 0];
        const scale = [0, 0, 0, 0];
        const include = [0, 0, 0, 0];

        offset[component] = translate;
        scale[component] = scaleFactor;
        include[component] = 1;

        programBuilder
            .buffers()
            .uniform(`${prefix(component)}Offset`, uniform(offset))
            .uniform(`${prefix(component)}Scale`, uniform(scale))
            .uniform(`${prefix(component)}Include`, uniform(include))
            .uniform(`${prefix(component)}Exp`, uniform(exponent));
    };

    scale.exponent = (...args) => {
        if (!args.length) {
            return exponent;
        }
        exponent = args[0];
        return scale;
    };

    rebindAll(scale, base);

    return scale;
};
