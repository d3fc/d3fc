export default (target, targetName, source, sourceName, ...curriedArgs) => {
    target[targetName] = (...args) => {
        const result = source[sourceName](...curriedArgs, ...args);
        if (result === source) {
            return target;
        }
        return result;
    };
};
