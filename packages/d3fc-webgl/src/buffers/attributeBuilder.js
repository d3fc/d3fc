
export default (_data) => {
    let numComponents = null;
    let buffer = null;
    let data = _data;
    let changed = true; // make this optional

    /**
     *
     * @param {WebGLRenderingContext} gl
     * @param {*} program
     * @param {*} name
     * @param {*} numElements
     */
    let bind = (gl, program, name, numElements) => {
        const dataType = getGLType(data.constructor, gl);

        buffer = buffer || gl.createBuffer();

        const location = gl.getAttribLocation(program, name);
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

        gl.vertexAttribPointer(
            location,
            numComponents || data.length / numElements,
            dataType,
            false,
            0,
            0);
        gl.enableVertexAttribArray(location);

        gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW);
    };

    const build = (gl, program, name, numElements) => {
        if (changed) {
            changed = false;
            bind(gl, program, name, numElements);
        }
    };

    function getGLType(type, gl) {
        switch (type) {
            // case Array: ?
        case Float32Array:
            return gl.FLOAT;
        case Int8Array:
            return gl.BYTE;
        case Int16Array:
            return gl.SHORT;
        case Uint8Array:
            return gl.UNSIGNED_BYTE;
        case Uint16Array:
            return gl.UNSIGNED_SHORT;
        default:
            throw new Error(`Attribute buffer type ${type.name} not supported`);
        }
    }

    build.bind = (...args) => {
        if (!args.length) {
            return bind;
        }
        bind = args[0];
        return build;
    };

    build.components = (...args) => {
        if (!args.length) {
            return numComponents;
        }
        numComponents = args[0];
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
