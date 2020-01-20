import baseAttributeBuilder from './baseAttributeBuilder';
import { rebindAll, exclude } from '@d3fc/d3fc-rebind';

export default () => {
    const base = baseAttributeBuilder();

    let data = null;
    let validSize = 0;

    const project = (elementCount, verticesPerElement) => {
        const components = base.size();
        const offset = base.offset();
        const componentsPerElement = verticesPerElement * components;
        const projectedData = new Float32Array(
            offset + elementCount * componentsPerElement
        );
        if (data.length !== verticesPerElement) {
            throw new Error(
                `Expected vertices array of size ${verticesPerElement}, recieved array with length ${data.length}.`
            );
        }
        let target = 0;
        for (let vertex = 0; vertex < verticesPerElement; vertex++) {
            if (data[vertex].length !== components) {
                throw new Error(
                    `Expected components array of size ${components}, recieved array with length ${data[vertex].length}.`
                );
            }
            for (let component = 0; component < components; component++) {
                projectedData[offset + target] = data[vertex][component];
                target++;
            }
        }
        for (
            let index = componentsPerElement;
            index < projectedData.length;
            index += componentsPerElement
        ) {
            projectedData.copyWithin(
                offset + index,
                offset,
                offset + componentsPerElement
            );
        }
        return projectedData;
    };

    const build = (gl, program, name, verticesPerElement, count) => {
        base(gl, program, name);

        if (validSize >= count) {
            return;
        }
        const projectedData = project(count, verticesPerElement);

        gl.bindBuffer(gl.ARRAY_BUFFER, base.buffer());
        gl.bufferData(gl.ARRAY_BUFFER, projectedData, gl.DYNAMIC_DRAW);

        validSize = count;
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
