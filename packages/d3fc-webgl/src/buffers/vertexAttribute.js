import baseAttribute from './baseAttribute';
import { rebind } from '@d3fc/d3fc-rebind';
import defaultArrayViewFactory from './arrayViewFactory';

export default () => {
    const base = baseAttribute();
    const arrayViewFactory = defaultArrayViewFactory();

    let dirty = true;
    let data = null;
    let size = 0;

    const project = () => {
        const componentsPerElement = data.length * size;
        const projectedData = arrayViewFactory(componentsPerElement);
        let target = 0;
        for (let vertex = 0; vertex < data.length; vertex++) {
            if (data[vertex].length !== size) {
                throw new Error(
                    `Expected components array of size ${size}, recieved array with length ${data[vertex].length}.`
                );
            }
            for (let component = 0; component < size; component++) {
                projectedData[target] = data[vertex][component];
                target++;
            }
        }
        return projectedData;
    };

    const build = (gl, program, name, count) => {
        base.size(size).type(build.type());

        base(gl, program, name);

        if (!dirty) {
            return;
        }

        const projectedData = project();

        gl.bufferData(gl.ARRAY_BUFFER, projectedData, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, base.buffer());

        dirty = false;
    };

    build.data = (...args) => {
        if (!args.length) {
            return data;
        }
        data = args[0];
        dirty = true;
        return build;
    };

    build.size = (...args) => {
        if (!args.length) {
            return size;
        }
        size = args[0];
        dirty = true;
        return build;
    };

    rebind(build, base, 'normalized');
    rebind(build, arrayViewFactory, 'type');

    return build;
};
