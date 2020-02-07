import baseAttributeBuilder from './baseAttributeBuilder';
import { rebind } from '@d3fc/d3fc-rebind';
import attributeProjector from './attributeProjector';

export default () => {
    const base = baseAttributeBuilder().divisor(1);
    const projector = attributeProjector();

    const build = (gl, program, name, count) => {
        base.size(build.size()).type(build.type());

        base(gl, program, name);

        if (!projector.dirty()) {
            return;
        }

        const projectedData = projector(count);
        gl.bindBuffer(gl.ARRAY_BUFFER, base.buffer());
        gl.bufferData(gl.ARRAY_BUFFER, projectedData, gl.DYNAMIC_DRAW);
    };

    rebind(build, base, 'normalized', 'divisor');
    rebind(build, projector, 'data', 'value', 'size', 'type');

    return build;
};
