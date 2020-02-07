import types, { getArrayViewConstructor } from './types';

export default () => {
    let type = types.FLOAT;
    let cachedArray = new Float32Array(0);

    const factory = requiredLength => {
        const ArrayType = getArrayViewConstructor(type);
        if (cachedArray.length > requiredLength) {
            cachedArray = new ArrayType(cachedArray.buffer, 0, requiredLength);
        } else if (cachedArray.length !== requiredLength) {
            cachedArray = new ArrayType(requiredLength);
        }
        return cachedArray;
    };

    factory.type = (...args) => {
        if (!args.length) {
            return type;
        }
        if (type !== args[0]) {
            type = args[0];
            const ArrayType = getArrayViewConstructor(type);
            cachedArray = new ArrayType(0);
        }
        return factory;
    };

    return factory;
};
