import baseAttributeBuilder from './baseAttributeBuilder';
import { rebindAll, exclude } from '@d3fc/d3fc-rebind';
import float32ArrayFactory from './float32ArrayFactory';

export default () => {
    const base = baseAttributeBuilder();
    const factory = float32ArrayFactory();

    let data = null;

    const project = verticesPerElement => {
        const components = base.size();
        const offset = base.offset();
        const componentsPerElement = verticesPerElement * components;
        const requiredLength = offset + componentsPerElement;
        const projectedData = factory(requiredLength);
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
        return projectedData;
    };

    const build = (gl, program, name, verticesPerElement, count) => {
        base(gl, program, name);

        if (base.validSize() >= verticesPerElement) {
            return;
        }

        const projectedData = project(verticesPerElement);

        gl.bufferData(gl.ARRAY_BUFFER, projectedData, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, base.buffer());

        base.validSize(verticesPerElement);
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
