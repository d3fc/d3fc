import regexify from './regexify';

export default (...exclusions) => {
    exclusions = regexify(exclusions);
    return (name) =>
        exclusions.every((exclusion) => !exclusion.test(name)) && name;
};
