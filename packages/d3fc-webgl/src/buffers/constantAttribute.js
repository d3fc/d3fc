import baseAttributeBuilder from './baseAttribute';
import { rebind } from '@d3fc/d3fc-rebind';

export default initialValue => {
    const base = baseAttributeBuilder().divisor(1);
    let value = initialValue;

    const build = (gl, program, name) => {
        base(gl, program, name);

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
        const location = gl.getAttribLocation(program, name);
        gl[`vertexAttrib${value.length}fv`](location, value);
        gl.disableVertexAttribArray(location);
    };

    build.value = (...args) => {
        if (!args.length) {
            return value;
        }
        value = args[0];
        return build;
    };

    rebind(build, base, 'normalized', 'size');

    return build;
};
