import uniformBuilder from '../buffers/uniformBuilder';
import glScaleBase from '../scale/glScaleBase';
import { rebindAll } from '@d3fc/d3fc-rebind';

export default () => {
    const base = glScaleBase();
    let exponent = 1;
    let doneProgram = false;

    function pow(b, e) {
        return Math.sign(b) * Math.pow(Math.abs(b), e);
    }

    const prefix = () => `pow${base.coordinate()}`;

    const apply = (program) => {
        if (!doneProgram) {
            updateProgram(program);
        }
        const domainSize = pow(base.domain()[1], exponent) - pow(base.domain()[0], exponent);
        const rangeSize = base.range()[1] - base.range()[0];

        const scaleFactor = rangeSize / domainSize;
        const translate = base.range()[0] - (scaleFactor * pow(base.domain()[0], exponent));

        const offset = [0, 0, 0, 0];
        const scale = [0, 0, 0, 0];
        const include = [0, 0, 0, 0];

        offset[base.coordinate()] = translate;
        scale[base.coordinate()] = scaleFactor;
        include[base.coordinate()] = 1;

        program.buffers()
            .uniform(`${prefix()}Offset`, uniformBuilder(offset))
            .uniform(`${prefix()}Scale`, uniformBuilder(scale))
            .uniform(`${prefix()}Include`, uniformBuilder(include))
            .uniform(`${prefix()}Exp`, uniformBuilder(exponent));
    };

    function updateProgram(program) {
        program.vertexShader()
            .appendHeader(`uniform vec4 ${prefix()}Offset;`)
            .appendHeader(`uniform vec4 ${prefix(0)}Scale;`)
            .appendHeader(`uniform vec4 ${prefix()}Include;`)
            .appendHeader(`uniform float ${prefix()}Exp;`);

        const powPart = `${prefix()}Offset + (${prefix()}Scale * sign(gl_Position) * pow(abs(gl_Position), vec4(${prefix()}Exp)))`;

        program.vertexShader()
            .appendBody(`gl_Position = (${prefix()}Include * (${powPart})) + ((1.0 - ${prefix()}Include) * gl_Position);`);

        doneProgram = true;
    }

    apply.exponent = (...args) => {
        if (!args.length) {
            return exponent;
        }
        exponent = args[0];
        return apply;
    };

    rebindAll(apply, base);

    return apply;
};
