import baseAttributeBuilder from './baseAttribute';
import { rebind } from '@d3fc/d3fc-rebind';

export default initialValue => {
    const base = baseAttributeBuilder().divisor(1);
    let value = initialValue;
    let dirty = true;

    const constantAttribute = programBuilder => {
        base(programBuilder);

        if (!dirty) {
            return;
        }

        if (!Array.isArray(value)) {
            throw new Error(`Expected an array, received: ${value}`);
        }
        if (value.length !== base.size()) {
            throw new Error(
                `Expected array of length: ${base.size()}, recieved array of length: ${
                    value.length
                }`
            );
        }
        const gl = programBuilder.context();
        gl[`vertexAttrib${value.length}fv`](base.location(), value);
        gl.disableVertexAttribArray(base.location());
        dirty = false;
    };

    constantAttribute.clear = () => {
        dirty = true;
    };

    constantAttribute.value = (...args) => {
        if (!args.length) {
            return value;
        }
        value = args[0];
        dirty = true;
        return constantAttribute;
    };

    rebind(constantAttribute, base, 'normalized', 'size', 'location');

    return constantAttribute;
};
