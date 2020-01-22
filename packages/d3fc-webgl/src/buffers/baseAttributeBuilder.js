import types from './types';

export default () => {
    let buffer = null;
    let size = 1; // per vertex
    let type = types.FLOAT;
    let normalized = false;
    let stride = 0;
    let offset = 0;
    let validSize = 0;

    const base = (gl, program, name) => {
        if (buffer == null || !gl.isBuffer(buffer)) {
            buffer = gl.createBuffer();
            validSize = 0;
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        const location = gl.getAttribLocation(program, name);
        gl.vertexAttribPointer(
            location,
            base.size(),
            base.type(),
            base.normalized(),
            base.stride(),
            base.offset()
        );
        gl.enableVertexAttribArray(location);
    };

    base.validSize = (...args) => {
        if (!args.length) {
            return validSize;
        }
        validSize = args[0];
        return base;
    };

    base.buffer = (...args) => {
        if (!args.length) {
            return buffer;
        }
        buffer = args[0];
        validSize = 0;
        return base;
    };

    base.size = (...args) => {
        if (!args.length) {
            return size;
        }
        size = args[0];
        validSize = 0;
        return base;
    };

    base.type = (...args) => {
        if (!args.length) {
            return type;
        }
        type = args[0];
        validSize = 0;
        return base;
    };

    base.normalized = (...args) => {
        if (!args.length) {
            return normalized;
        }
        normalized = args[0];
        validSize = 0;
        return base;
    };

    base.stride = (...args) => {
        if (!args.length) {
            return stride;
        }
        stride = args[0];
        validSize = 0;
        return base;
    };

    base.offset = (...args) => {
        if (!args.length) {
            return offset;
        }
        offset = args[0];
        validSize = 0;
        return base;
    };

    return base;
};
