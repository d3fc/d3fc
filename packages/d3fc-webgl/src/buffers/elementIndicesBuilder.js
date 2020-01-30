export default () => {
    let buffer = null;
    let data = null;
    let changed = false;

    const base = gl => {
        if (!changed) {
            return;
        }
        if (buffer == null) {
            buffer = gl.createBuffer();
        }
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
        gl.bufferData(
            gl.ELEMENT_ARRAY_BUFFER,
            new Uint16Array(data),
            gl.STATIC_DRAW
        );
    };

    base.buffer = (...args) => {
        if (!args.length) {
            return buffer;
        }
        buffer = args[0];
        return base;
    };

    base.data = (...args) => {
        if (!args.length) {
            return data;
        }
        changed = true;
        data = args[0];
        return base;
    };

    return base;
};
