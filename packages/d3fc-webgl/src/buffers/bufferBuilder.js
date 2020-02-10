export default () => {
    const attributes = {};
    const uniforms = {};
    let elementIndices = null;

    const build = (programBuilder, program) => {
        const gl = programBuilder.context();
        Object.keys(attributes).forEach(name => {
            const attribute = attributes[name];
            if (typeof attribute !== 'function') {
                throw new Error(
                    `Expected an attribute for ${name}, found ${attribute}`
                );
            }
            attribute(gl, program, name);
        });

        Object.keys(uniforms).forEach(name => {
            const uniform = uniforms[name];
            if (typeof uniform !== 'function') {
                throw new Error(
                    `Expected a uniform for ${name}, found ${uniform}`
                );
            }
            const location = gl.getUniformLocation(program, name);
            uniform.location(location)(programBuilder);
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
