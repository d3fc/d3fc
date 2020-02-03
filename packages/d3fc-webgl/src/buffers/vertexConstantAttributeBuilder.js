import baseAttributeBuilder from './baseAttributeBuilder';
import { rebindAll, exclude } from '@d3fc/d3fc-rebind';
import float32ArrayFactory from './float32ArrayFactory';

export default () => {
    const base = baseAttributeBuilder();
    const factory = float32ArrayFactory();

    let data = null;

    const project = () => {
        const components = base.size();
        const offset = base.offset();
        const componentsPerElement = data.length * components;
        const requiredLength = offset + componentsPerElement;
        const projectedData = factory(requiredLength);
        let target = 0;
        for (let vertex = 0; vertex < data.length; vertex++) {
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

    const build = (gl, program, name, count) => {
        base(gl, program, name);

        if (!base.hasPropertyChanged()) {
            return;
        }

        const projectedData = project();

        gl.bufferData(gl.ARRAY_BUFFER, projectedData, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, base.buffer());

        base.hasPropertyChanged(false);
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
