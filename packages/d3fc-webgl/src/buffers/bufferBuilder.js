export default () => {
    const attributes = {};
    const uniforms = {};
    let elementIndices = null;

    const build = (gl, program, verticesPerElement, count) => {
        Object.keys(attributes).forEach(key => {
            attributes[key](gl, program, key, verticesPerElement, count);
        });

        Object.keys(uniforms).forEach(key => {
            uniforms[key](gl, program, key);
        });

        if (elementIndices !== null) {
            elementIndices(gl);
        }
    };

    build.attribute = (...args) => {
        if (args.length === 1) {
            return attributes[args[0]];
        }
        attributes[args[0]] = args[1];
        return build;
    };

    build.uniform = (...args) => {
        if (args.length === 1) {
            return uniforms[args[0]];
        }
        uniforms[args[0]] = args[1];
        return build;
    };

    build.elementIndices = (...args) => {
        if (!args.length) {
            return elementIndices;
        }
        elementIndices = args[0];
        return build;
    };

    return build;
};
