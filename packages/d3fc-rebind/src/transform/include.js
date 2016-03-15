import regexify from './regexify';

export default (...inclusions) => {
    inclusions = regexify(inclusions);
    return (name) =>
      inclusions.some((inclusion) => inclusion.test(name)) && name;
};
