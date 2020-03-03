import baseAttribute from './baseAttribute';
import { rebind } from '@d3fc/d3fc-rebind';
import attributeProjector from './attributeProjector';

export default () => {
    const base = baseAttribute().divisor(1);
    const projector = attributeProjector();

    const elementAttribute = programBuilder => {
        base.size(elementAttribute.size()).type(elementAttribute.type());

        base(programBuilder);

        if (!projector.dirty()) {
            return;
        }

        const projectedData = projector();
        const gl = programBuilder.context();
        gl.bindBuffer(gl.ARRAY_BUFFER, base.buffer());
        gl.bufferData(gl.ARRAY_BUFFER, projectedData, gl.DYNAMIC_DRAW);
    };

    elementAttribute.clear = () => {
        base.buffer(null);
        projector.clear();
    };

    rebind(elementAttribute, base, 'normalized', 'location');
    rebind(elementAttribute, projector, 'data', 'value', 'size', 'type');

    return elementAttribute;
};
