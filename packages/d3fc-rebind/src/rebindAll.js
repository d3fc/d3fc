import createReboundMethod from './createReboundMethod';

const createTransform = (transforms) =>
    (name) => transforms.reduce(
        (name, fn) => name && fn(name),
        name
    );

export default (target, source, ...transforms) => {
    const transform = createTransform(transforms);
    for (const name of Object.keys(source)) {
        const result = transform(name);
        if (result) {
            target[result] = createReboundMethod(target, source, name);
        }
    }
    return target;
};
