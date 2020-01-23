import baseAttributeBuilder from './baseAttributeBuilder';
import { rebindAll, exclude } from '@d3fc/d3fc-rebind';

export default () => {
    const base = baseAttributeBuilder().divisor(1);

    let value = (data, element, vertex, component, index) => data[element];
    let data = null;

    const project = elementCount => {
        const components = base.size();
        const offset = base.offset();
        const projectedData = new Float32Array(
            offset + elementCount * components
        );
        let element = 0;
        for (
            let index = offset;
            index < projectedData.length;
            index += components
        ) {
            projectedData.fill(value(data, element), index, index + components);
            element++;
        }
        return projectedData;
    };

    const build = (gl, program, name, verticesPerElement, count) => {
        base(gl, program, name, verticesPerElement);

        if (base.validSize() >= count) {
            return;
        }

        if (typeof value === 'function') {
            const projectedData = project(count);
            gl.bindBuffer(gl.ARRAY_BUFFER, base.buffer());
            gl.bufferData(gl.ARRAY_BUFFER, projectedData, gl.DYNAMIC_DRAW);
        } else if (Array.isArray(value)) {
            if (value.length === base.size()) {
                const location = gl.getAttribLocation(program, name);
                gl[`vertexAttrib${value.length}fv`](location, value);
                gl.disableVertexAttribArray(location);
            } else {
                throw new Error(
                    `Expected array of length: ${base.size()}, recieved array of length: ${
                        value.length
                    }`
                );
            }
        } else {
            throw new Error(`Expected function or array, received: ${value}`);
        }
        base.validSize(count);
    };

    build.value = (...args) => {
        if (!args.length) {
            return value;
        }
        value = args[0];
        base.validSize(0);
        return build;
    };

    build.data = (...args) => {
        if (!args.length) {
            return data;
        }
        data = args[0];
        base.validSize(0);
        return build;
    };

    rebindAll(build, base, exclude('buffer'));

    return build;
};
