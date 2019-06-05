export default (gl) => {
    let glBuffer = gl.createBuffer();

    const buffer = (array) => {
        // Select this buffer as the one to apply buffer operations to.
        gl.bindBuffer(gl.ARRAY_BUFFER, glBuffer);

        // Only create a copy if it's not already a Float32Array
        const srcArray = (array.constructor === Float32Array) ? array : new Float32Array(array);

        gl.bufferData(gl.ARRAY_BUFFER, srcArray, gl.STATIC_DRAW);
        return glBuffer;
    };

    buffer.addr = () => glBuffer;
    return buffer;
};
