import uniformBuilder from '../buffers/uniformBuilder';
import glScaleBase from '../scale/glScaleBase';
import { rebindAll } from '@d3fc/d3fc-rebind';

export default () => {
    const base = glScaleBase();
    let doneProgram = false;

    const prefix = () => `linear${base.coordinate()}`;

    const apply = (program) => {
        if (!doneProgram) {
            updateProgram(program);
        }
        const domainSize = base.domain()[1] - base.domain()[0];
        const rangeSize = base.range()[1] - base.range()[0];

        const translate = (base.range()[0] * (domainSize / rangeSize)) - base.domain()[0];
        const scaleFactor = rangeSize / domainSize;

        const offset = [0, 0, 0, 0];
        const scale = [1, 1, 1, 1];

        offset[base.coordinate()] = translate;
        scale[base.coordinate()] = scaleFactor;

        program.buffers()
            .uniform(`${prefix()}Offset`, uniformBuilder(offset))
            .uniform(`${prefix()}Scale`, uniformBuilder(scale));
    };

    function updateProgram(program) {
        program.vertexShader()
            .appendHeader(`uniform vec4 ${prefix()}Offset;`)
            .appendHeader(`uniform vec4 ${prefix()}Scale;`);

        program.vertexShader()
            .appendBody(`gl_Position = gl_Position + ${prefix()}Offset;`)
            .appendBody(`gl_Position = gl_Position * ${prefix()}Scale;`);

        doneProgram = true;
    }

    rebindAll(apply, base);

    return apply;
};
