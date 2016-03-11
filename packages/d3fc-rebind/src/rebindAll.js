import createReboundMethod from './createReboundMethod';

const capitalizeFirstLetter = (str) => str[0].toUpperCase() + str.slice(1);

export default (target, source, prefix = '', ...exclusions) => {

    for (const exclusion of exclusions) {
        if (typeof exclusion === 'string' && typeof source[exclusion] !== 'function') {
            throw new Error(`Attempt to exclude ${exclusion} which isn\'t a function on the source object`);
        }
    }

    exclusions = exclusions.map((exclusion) =>
        typeof exclusion === 'string'
            ? new RegExp(`^${exclusion}$`) : exclusion
    );

    const targetName = prefix
        ? (name) => prefix + capitalizeFirstLetter(name)
        : (name) => name;

    const names = Object.keys(source)
        .filter((name) =>
            !exclusions.some((exclusion) => name.match(exclusion))
        );

    for (const name of names) {
        target[targetName(name)] = createReboundMethod(target, source, name);
    }
};
