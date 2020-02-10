import uniform from '../buffers/uniform';
import glScaleBase from '../scale/glScaleBase';
import { rebindAll } from '@d3fc/d3fc-rebind';

export default () => {
    const base = glScaleBase();

    const prefix = component => `linear${component}`;

    const scale = (programBuilder, identifier, component) => {
        programBuilder
            .vertexShader()
            .appendHeaderIfNotExists(`uniform vec4 ${prefix(component)}Offset;`)
            .appendHeaderIfNotExists(`uniform vec4 ${prefix(component)}Scale;`)
            .appendBody(
                `${identifier} = ${identifier} + ${prefix(component)}Offset;`
            )
            .appendBody(
                `${identifier} = ${identifier} * ${prefix(component)}Scale;`
            );

        const domainSize = base.domain()[1] - base.domain()[0];
        const rangeSize = base.range()[1] - base.range()[0];

        const translate =
            base.range()[0] * (domainSize / rangeSize) - base.domain()[0];
        const scaleFactor = rangeSize / domainSize;

        const offset = [0, 0, 0, 0];
        const scale = [1, 1, 1, 1];

        offset[component] = translate;
        scale[component] = scaleFactor;

        programBuilder
            .buffers()
            .uniform(`${prefix(component)}Offset`, uniform(offset))
            .uniform(`${prefix(component)}Scale`, uniform(scale));
    };

    rebindAll(scale, base);

    return scale;
};
