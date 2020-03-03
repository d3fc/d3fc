import baseAttribute from './baseAttribute';
import { rebind } from '@d3fc/d3fc-rebind';
import attributeProjector from './attributeProjector';

export default () => {
    const base = baseAttribute();
    const projector = attributeProjector();

    const vertexAttribute = programBuilder => {
        base.size(vertexAttribute.size()).type(vertexAttribute.type());

        base(programBuilder);

        if (!projector.dirty()) {
            return;
        }

        const projectedData = projector();
        const gl = programBuilder.context();
        gl.bindBuffer(gl.ARRAY_BUFFER, base.buffer());
        gl.bufferData(gl.ARRAY_BUFFER, projectedData, gl.DYNAMIC_DRAW);
    };

    vertexAttribute.clear = () => {
        base.buffer(null);
        projector.clear();
    };

    rebind(vertexAttribute, base, 'normalized', 'location');
    rebind(vertexAttribute, projector, 'data', 'value', 'size', 'type');

    return vertexAttribute;
};
