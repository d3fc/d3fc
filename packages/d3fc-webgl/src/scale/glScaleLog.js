import uniformBuilder from '../buffers/uniformBuilder';
import glScaleBase from '../scale/glScaleBase';
import { rebindAll } from '@d3fc/d3fc-rebind';

export default () => {
    const glBase = glScaleBase();
    let base = 10;

    function log(v, base) {
        return Math.log10(v) / Math.log10(base);
    }

    const prefix = () => `log${glBase.coordinate()}`;

    const apply = program => {
        updateProgram(program);

        const domainSize =
            log(glBase.domain()[1], base) - log(glBase.domain()[0], base);
        const rangeSize = glBase.range()[1] - glBase.range()[0];

        const scaleFactor = rangeSize / domainSize;
        const translate =
            glBase.range()[0] - scaleFactor * log(glBase.domain()[0], base);

        const offset = [0, 0, 0, 0];
        const scale = [0, 0, 0, 0];
        const include = [0, 0, 0, 0];

        offset[glBase.coordinate()] = translate;
        scale[glBase.coordinate()] = scaleFactor;
        include[glBase.coordinate()] = 1;

        program
            .buffers()
            .uniform(`${prefix()}Offset`, uniformBuilder(offset))
            .uniform(`${prefix()}Scale`, uniformBuilder(scale))
            .uniform(`${prefix()}Include`, uniformBuilder(include))
            .uniform(`${prefix()}Base`, uniformBuilder(base));
    };

    function updateProgram(program) {
        program
            .vertexShader()
            .appendHeader(`uniform vec4 ${prefix()}Offset;`)
            .appendHeader(`uniform vec4 ${prefix()}Scale;`)
            .appendHeader(`uniform vec4 ${prefix()}Include;`)
            .appendHeader(`uniform float ${prefix()}Base;`);
        apply.scaleComponent(program, 'gl_Position');
    }

    apply.scaleComponent = (program, component) => {
        const logPart = `${prefix()}Offset + (${prefix()}Scale * clamp(log(${component}) / log(${prefix()}Base), -inf, inf))`;

        program
            .vertexShader()
            .appendBody(
                `${component} = (${prefix()}Include * (${logPart})) + ((1.0 - ${prefix()}Include) * ${component});`
            );
        return apply;
    };

    apply.base = (...args) => {
        if (!args.length) {
            return base;
        }
        base = args[0];
        return apply;
    };

    rebindAll(apply, glBase);

    return apply;
};
