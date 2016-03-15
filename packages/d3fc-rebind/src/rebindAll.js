const createTransform = (transforms) =>
    (name) => transforms.reduce(
        (name, fn) => name && fn(name),
        name
    );

const createReboundMethod = (target, source, name) => {
    const method = source[name];
    if (typeof method !== 'function') {
        throw new Error(`Attempt to rebind ${name} which isn't a function on the source object`);
    }
    return (...args) => {
        var value = method.apply(source, args);
        return value === source ? target : value;
    };
};

export default (target, source, ...transforms) => {
    const transform = createTransform(transforms);
    for (const name of Object.keys(source)) {
        const result = transform(name);
        if (result) {
            target[result] = createReboundMethod(target, source, name);
        }
    }
};
