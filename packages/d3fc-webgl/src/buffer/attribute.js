import baseAttribute from './baseAttribute';
import { rebind } from '@d3fc/d3fc-rebind';
import attributeProjector from './attributeProjector';

export default () => {
    const base = baseAttribute();
    const projector = attributeProjector();

    const attribute = programBuilder => {
        base.size(attribute.size()).type(attribute.type());

        base(programBuilder);

        if (!projector.dirty()) {
            return;
        }

        const projectedData = projector();
        const gl = programBuilder.context();
        gl.bindBuffer(gl.ARRAY_BUFFER, base.buffer());
        gl.bufferData(gl.ARRAY_BUFFER, projectedData, gl.DYNAMIC_DRAW);
    };

    attribute.clear = () => {
        base.buffer(null);
        projector.clear();
    };

    rebind(attribute, base, 'normalized', 'location', 'divisor');
    rebind(attribute, projector, 'data', 'value', 'size', 'type');

    return attribute;
};
