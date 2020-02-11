export default () => {
    let domain = [0, 1];
    let range = [-1, 1];

    const base = () => {};

    base.domain = (...args) => {
        if (!args.length) {
            return domain;
        }
        domain = args[0];
        return base;
    };

    base.range = (...args) => {
        if (!args.length) {
            return range;
        }
        range = args[0];
        return base;
    };

    return base;
};
