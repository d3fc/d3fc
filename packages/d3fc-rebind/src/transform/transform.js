const transformer = (...fns) => {

    const transform = (name) => fns.reduce(
      (name, fn) => name && fn(name),
      name
    );

    transform.lift = (fn) => transformer(...fns, fn);

    for (const key of Object.keys(transformer)) {
        transform[key] = transformer[key];
    }

    return transform;
};

export default transformer;
