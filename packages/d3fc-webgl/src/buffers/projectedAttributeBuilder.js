import baseAttributeBuilder from './baseAttributeBuilder';
import { rebindAll, exclude } from '@d3fc/d3fc-rebind';

export default () => {
    const base = baseAttributeBuilder();

    let value = (data, element, vertex, component, index) => data[index];
    let data = null;
    let validSize = 0;

    const project = (elementCount, verticesPerElement) => {
        const components = base.size();
        const offset = base.offset();
        const projectedData = new Float32Array(
            offset + elementCount * verticesPerElement * components
        );
        let index = 0;
        for (let element = 0; element < elementCount; element++) {
            for (let vertex = 0; vertex < verticesPerElement; vertex++) {
                for (let component = 0; component < components; component++) {
                    projectedData[offset + index++] = value(
                        data,
                        element,
                        vertex,
                        component,
                        index
                    );
                }
            }
        }
        return projectedData;
    };

    const build = (gl, program, name, verticesPerElement, count) => {
        if (validSize >= count) {
            return;
        }

        const projectedData = project(count, verticesPerElement);

        base(gl, program, name);

        gl.bindBuffer(gl.ARRAY_BUFFER, base.buffer());
        gl.bufferData(gl.ARRAY_BUFFER, projectedData, gl.DYNAMIC_DRAW);

        validSize = count;
    };

    build.value = (...args) => {
        if (!args.length) {
            return value;
        }
        value = args[0];
        validSize = 0;
        return build;
    };

    build.data = (...args) => {
        if (!args.length) {
            return data;
        }
        data = args[0];
        validSize = 0;
        return build;
    };

    rebindAll(build, base, exclude('buffer'));

    return build;
};
