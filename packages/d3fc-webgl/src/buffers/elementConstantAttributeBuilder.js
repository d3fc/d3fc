import baseAttributeBuilder from './baseAttributeBuilder';
import { rebindAll, exclude } from '@d3fc/d3fc-rebind';
import arrayViewFactory from './arrayViewFactory';

export default () => {
    const base = baseAttributeBuilder().divisor(1);
    const factory = arrayViewFactory();

    let value = (data, element) => data[element];
    let data = null;

    const project = elementCount => {
        const componentCount = base.size();
        const offset = base.offset();
        const requiredLength = offset + elementCount * componentCount;
        const projectedData = factory.type(base.type())(requiredLength);

        if (componentCount > 1) {
            for (let element = 0; element < elementCount; element++) {
                const componentValues = value(data, element);
                for (
                    let component = 0;
                    component < componentCount;
                    component++
                ) {
                    projectedData[
                        offset + element * componentCount + component
                    ] = componentValues[component];
                }
            }
        } else {
            for (let element = 0; element < elementCount; element++) {
                projectedData[offset + element] = value(data, element);
            }
        }

        return projectedData;
    };

    const build = (gl, program, name, count) => {
        base(gl, program, name);

        if (!base.hasPropertyChanged()) {
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
        base.hasPropertyChanged(false);
    };

    build.value = (...args) => {
        if (!args.length) {
            return value;
        }
        value = args[0];
        base.hasPropertyChanged(true);
        return build;
    };

    build.data = (...args) => {
        if (!args.length) {
            return data;
        }
        data = args[0];
        base.hasPropertyChanged(true);
        return build;
    };

    rebindAll(build, base, exclude('buffer'));

    return build;
};
