import createReboundMethod from './createReboundMethod';

export default (target, source, ...names) => {
    for (const name of names) {
        target[name] = createReboundMethod(target, source, name);
    }
    return target;
};
