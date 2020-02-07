import baseAttributeBuilder from './baseAttributeBuilder';
import { rebind } from '@d3fc/d3fc-rebind';
import attributeProjector from './attributeProjector';
import { length } from './types';

export default (minOffset = 0, maxOffset = 0) => {
    if (minOffset > 0 || maxOffset < 0) {
        throw new Error(
            `Offset values (${minOffset} & ${maxOffset}) must straddle 0 `
        );
    }
    const base = baseAttributeBuilder().divisor(1);
    const projector = attributeProjector();

    const build = (gl, program, name, count) => {
        const elementSize = build.size() * length(build.type());
        const bufferOffset = Math.abs(minOffset) * elementSize;
        const bufferLength =
            (Math.abs(minOffset) + count + maxOffset) * elementSize;

        base.offset(bufferOffset)
            .size(build.size())
            .type(build.type());

        base(gl, program, name);

        if (!projector.dirty()) {
            return;
        }
        const projectedData = projector(count);

        gl.bindBuffer(gl.ARRAY_BUFFER, base.buffer());
        gl.bufferData(gl.ARRAY_BUFFER, bufferLength, gl.DYNAMIC_DRAW);
        gl.bufferSubData(gl.ARRAY_BUFFER, bufferOffset, projectedData);
    };

    build.offset = offset => {
        if (minOffset > offset || offset > maxOffset) {
            throw new Error(
                `Requested offset ${offset} exceeds bounds (${minOffset} & ${maxOffset}) `
            );
        }
        return (gl, program, name, count) => {
            base.offset(
                (offset - minOffset) * build.size() * length(build.type())
            );
            base(gl, program, name);
        };
    };

    rebind(build, base, 'normalized');
    rebind(build, projector, 'data', 'value', 'size', 'type');

    return build;
};
