import baseAttributeBuilder from './baseAttribute';
import { rebind } from '@d3fc/d3fc-rebind';

export default initialValue => {
    const base = baseAttributeBuilder().divisor(1);
    let value = initialValue;

    const constantAttribute = programBuilder => {
        base(programBuilder);

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
    };

    constantAttribute.value = (...args) => {
        if (!args.length) {
            return value;
        }
        value = args[0];
        return constantAttribute;
    };

    rebind(constantAttribute, base, 'normalized', 'size', 'location');

    return constantAttribute;
};
