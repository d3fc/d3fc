import uniform from '../buffer/uniform';
import baseScale from './base';
import { rebindAll } from '@d3fc/d3fc-rebind';

export default () => {
    const glBase = baseScale();
    let base = 10;

    function log(v, base) {
        return Math.log10(v) / Math.log10(base);
    }

    const prefix = component => `log${component}`;

    const scale = (programBuilder, identifier, component) => {
        const logPart = `${prefix(component)}Offset + (${prefix(
            component
        )}Scale * clamp(log(${identifier}) / log(${prefix(
            component
        )}Base), -inf, inf))`;

        programBuilder
            .vertexShader()
            .appendHeaderIfNotExists(`uniform vec4 ${prefix(component)}Offset;`)
            .appendHeaderIfNotExists(`uniform vec4 ${prefix(component)}Scale;`)
            .appendHeaderIfNotExists(
                `uniform vec4 ${prefix(component)}Include;`
            )
            .appendHeaderIfNotExists(`uniform float ${prefix(component)}Base;`)
            .appendBody(
                `${identifier} = (${prefix(
                    component
                )}Include * (${logPart})) + ((1.0 - ${prefix(
                    component
                )}Include) * ${identifier});`
            );

        const domainSize =
            log(glBase.domain()[1], base) - log(glBase.domain()[0], base);
        const rangeSize = glBase.range()[1] - glBase.range()[0];

        const scaleFactor = rangeSize / domainSize;
        const translate =
            glBase.range()[0] - scaleFactor * log(glBase.domain()[0], base);

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
            .uniform(`${prefix(component)}Base`, uniform(base));
    };

    scale.base = (...args) => {
        if (!args.length) {
            return base;
        }
        base = args[0];
        return scale;
    };

    rebindAll(scale, glBase);

    return scale;
};
