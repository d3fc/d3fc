export default _data => {
    let data = _data;
    let changed = true;

    let bind = (gl, program, name) => {
        const loc = gl.getUniformLocation(program, name);

        // provide a way of setting which of the uniform functions to use?

        if (data instanceof Array) {
            switch (data.length) {
                case 1:
                    gl.uniform1fv(loc, data);
                    break;
                case 2:
                    gl.uniform2fv(loc, data);
                    break;
                case 3:
                    gl.uniform3fv(loc, data);
                    break;
                case 4:
                    gl.uniform4fv(loc, data);
                    break;
                default:
                    throw new Error(
                        `Uniform supports up to 4 elements. ${data.length} provided.`
                    );
            }
        } else {
            gl.uniform1f(loc, data);
        }
    };

    const build = (gl, program, name) => {
        if (changed) {
            changed = false;
            bind(gl, program, name);
        }
    };

    build.bind = (...args) => {
        if (!args.length) {
            return bind;
        }
        bind = args[0];
        return build;
    };

    build.data = (...args) => {
        if (!args.length) {
            return data;
        }
        data = args[0];
        changed = true;
        return build;
    };

    return build;
};
