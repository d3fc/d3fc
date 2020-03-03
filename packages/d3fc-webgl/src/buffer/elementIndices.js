export default initialData => {
    let buffer = null;
    let data = initialData;
    let dirty = true;

    const base = programBuilder => {
        const gl = programBuilder.context();

        if (buffer == null) {
            buffer = gl.createBuffer();
        }
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);

        if (!dirty) {
            return;
        }

        gl.bufferData(
            gl.ELEMENT_ARRAY_BUFFER,
            new Uint16Array(data),
            gl.STATIC_DRAW
        );

        dirty = false;
    };

    base.clear = () => {
        buffer = null;
        dirty = true;
    };

    base.data = (...args) => {
        if (!args.length) {
            return data;
        }
        dirty = true;
        data = args[0];
        return base;
    };

    return base;
};
