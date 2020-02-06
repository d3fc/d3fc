import typeMapper from './typeMapper';

export default () => {
    let ArrayType = Float32Array;
    let cachedArray = new ArrayType(0);

    const factory = requiredLength => {
        if (cachedArray.length > requiredLength) {
            cachedArray = new ArrayType(cachedArray.buffer, 0, requiredLength);
        } else if (cachedArray.length !== requiredLength) {
            cachedArray = new ArrayType(requiredLength);
        }
        return cachedArray;
    };

    factory.type = (...args) => {
        if (!args.length) {
            return ArrayType;
        }
        ArrayType = typeMapper(args[0]);
        cachedArray = new ArrayType(0);
        return factory;
    };

    return factory;
};
