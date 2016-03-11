export default (target, source, name) => {
    const method = source[name];
    if (typeof method !== 'function') {
        throw new Error(`Attempt to rebind ${name} which isn't a function on the source object`);
    }
    return (...args) => {
        var value = method.apply(source, args);
        return value === source ? target : value;
    };
};
