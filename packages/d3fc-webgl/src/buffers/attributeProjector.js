import defaultArrayViewFactory from './arrayViewFactory';
import types from './types';

export default () => {
    let dirty = true;
    let size = 1; // per vertex
    let type = types.FLOAT;
    let arrayViewFactory = defaultArrayViewFactory();
    let value = (data, element) => data[element];
    let data = null;

    const projector = elementCount => {
        const requiredLength = elementCount * size;
        const projectedData = arrayViewFactory.type(type)(requiredLength);

        if (size > 1) {
            for (let element = 0; element < elementCount; element++) {
                const componentValues = value(data, element);
                for (let component = 0; component < size; component++) {
                    projectedData[element * size + component] =
                        componentValues[component];
                }
            }
        } else {
            for (let element = 0; element < elementCount; element++) {
                projectedData[element] = value(data, element);
            }
        }

        dirty = false;

        return projectedData;
    };

    projector.dirty = () => dirty;

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
