import baseAttribute from './baseAttribute';
import { rebind } from '@d3fc/d3fc-rebind';
import attributeProjector from './attributeProjector';
import { length } from './types';

export default (minOffset = 0, maxOffset = 0) => {
    if (minOffset > 0 || maxOffset < 0) {
        throw new Error(
            `Offset values (${minOffset} & ${maxOffset}) must straddle 0 `
        );
    }
    const base = baseAttribute();
    const projector = attributeProjector();

    const adjacentAttribute = programBuilder => {
        const elementSize =
            adjacentAttribute.size() * length(adjacentAttribute.type());
        const bufferOffset = Math.abs(minOffset) * elementSize;

        base.offset(bufferOffset)
            .size(adjacentAttribute.size())
            .type(adjacentAttribute.type());

        base(programBuilder);

        if (!projector.dirty()) {
            return;
        }
        const projectedData = projector();
        const bufferPadding = maxOffset * elementSize;
        const bufferLength =
            bufferOffset +
            projectedData.length * length(adjacentAttribute.type()) +
            bufferPadding;

        const gl = programBuilder.context();
        gl.bindBuffer(gl.ARRAY_BUFFER, base.buffer());
        gl.bufferData(gl.ARRAY_BUFFER, bufferLength, gl.DYNAMIC_DRAW);
        gl.bufferSubData(gl.ARRAY_BUFFER, bufferOffset, projectedData);
    };

    adjacentAttribute.offset = offset => {
        if (minOffset > offset || offset > maxOffset) {
            throw new Error(
                `Requested offset ${offset} exceeds bounds (${minOffset} & ${maxOffset}) `
            );
        }
        const offsetAttribute = programBuilder => {
            base.offset(
                (offset - minOffset) *
                    adjacentAttribute.size() *
                    length(adjacentAttribute.type())
            );
            base(programBuilder);
        };

        rebind(offsetAttribute, adjacentAttribute, 'clear', 'location');

        return offsetAttribute;
    };

    adjacentAttribute.clear = () => {
        base.buffer(null);
        projector.clear();
    };

    rebind(adjacentAttribute, base, 'normalized', 'location', 'divisor');
    rebind(adjacentAttribute, projector, 'data', 'value', 'size', 'type');

    return adjacentAttribute;
};
