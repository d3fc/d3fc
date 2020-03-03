import defaultArrayViewFactory from './arrayViewFactory';
import types from './types';

export default () => {
    let dirty = true;
    let size = 1; // per vertex
    let type = types.FLOAT;
    let arrayViewFactory = defaultArrayViewFactory();
    let value = (d, i) => d;
    let data = null;

    const projector = () => {
        const length = data.length;
        const projectedData = arrayViewFactory.type(type)(length * size);

        if (size > 1) {
            for (let i = 0; i < length; i++) {
                const componentValues = value(data[i], i);
                if (componentValues.length !== size) {
                    throw new Error(
                        `Expected components array of size ${size}, recieved array with length ${componentValues.length}.`
                    );
                }
                for (let component = 0; component < size; component++) {
                    projectedData[i * size + component] =
                        componentValues[component];
                }
            }
        } else {
            for (let i = 0; i < length; i++) {
                const componentValue = value(data[i], i);
                if (Array.isArray(componentValue)) {
                    throw new Error(
                        `Expected a single component value, recieved array with length ${componentValue.length}.`
                    );
                }
                projectedData[i] = componentValue;
            }
        }

        dirty = false;

        return projectedData;
    };

    projector.dirty = () => dirty;

    projector.clear = () => {
        dirty = true;
    };

    projector.size = (...args) => {
        if (!args.length) {
            return size;
        }
        size = args[0];
        dirty = true;
        return projector;
    };

    projector.type = (...args) => {
        if (!args.length) {
            return type;
        }
        type = args[0];
        dirty = true;
        return projector;
    };

    projector.arrayViewFactory = (...args) => {
        if (!args.length) {
            return arrayViewFactory;
        }
        arrayViewFactory = args[0];
        dirty = true;
        return projector;
    };

    projector.value = (...args) => {
        if (!args.length) {
            return value;
        }
        value = args[0];
        dirty = true;
        return projector;
    };

    projector.data = (...args) => {
        if (!args.length) {
            return data;
        }
        data = args[0];
        dirty = true;
        return projector;
    };

    return projector;
};
