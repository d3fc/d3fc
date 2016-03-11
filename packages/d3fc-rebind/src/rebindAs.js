import createReboundMethod from './createReboundMethod';

export default (target, source, mappings) => {
    for (const name of Object.keys(mappings)) {
        target[name] = createReboundMethod(target, source, mappings[name]);
    }
    return target;
};
