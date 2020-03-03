export default initialData => {
    let location = -1;
    let data = initialData;
    let dirty = true;

    const build = programBuilder => {
        if (!dirty) {
            return;
        }

        const gl = programBuilder.context();

        if (Array.isArray(data)) {
            switch (data.length) {
                case 1:
                    gl.uniform1fv(location, data);
                    break;
                case 2:
                    gl.uniform2fv(location, data);
                    break;
                case 3:
                    gl.uniform3fv(location, data);
                    break;
                case 4:
                    gl.uniform4fv(location, data);
                    break;
                default:
                    throw new Error(
                        `Uniform supports up to 4 elements. ${data.length} provided.`
                    );
            }
        } else {
            gl.uniform1f(location, data);
        }

        dirty = false;
    };

    build.clear = () => {
        dirty = true;
    };

    build.location = (...args) => {
        if (!args.length) {
            return location;
        }
        if (location !== args[0]) {
            location = args[0];
            dirty = true;
        }
        return build;
    };

    build.data = (...args) => {
        if (!args.length) {
            return data;
        }
        data = args[0];
        dirty = true;
        return build;
    };

    return build;
};
