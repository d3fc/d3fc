import baseAttribute from './baseAttribute';
import { rebind } from '@d3fc/d3fc-rebind';
import attributeProjector from './attributeProjector';
import { length } from './types';

export default () => {
    const base = baseAttribute().divisor(1);
    const projector = attributeProjector();
    const queue = [];
    let count = 0;

    const attribute = programBuilder => {
        base.size(attribute.size()).type(attribute.type());

        const requiresInitialisation = base.buffer() == null;

        base(programBuilder);

        const gl = programBuilder.context();
        const bytes = attribute.size() * length(attribute.type());

        if (requiresInitialisation) {
            gl.bindBuffer(gl.ARRAY_BUFFER, base.buffer());
            gl.bufferData(gl.ARRAY_BUFFER, count * bytes, gl.DYNAMIC_DRAW);
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, base.buffer());
        while (queue.length > 0) {
            const { data, offset } = queue.shift();
            projector.data(data);
            const projectedData = projector();
            gl.bufferSubData(gl.ARRAY_BUFFER, offset * bytes, projectedData);
        }
    };

    attribute.clear = () => {
        base.buffer(null);
    };

    attribute.enqueue = (data, offset = 0) => {
        queue.push({ data, offset });
    };

    attribute.count = (...args) => {
        if (!args.length) {
            return count;
        }
        count = args[0];
        return attribute;
    };

    rebind(attribute, base, 'normalized', 'location');
    rebind(attribute, projector, 'value', 'size', 'type');

    return attribute;
};
