import initShaders from '../helper/initShaders';
import buffer from '../helper/buffer';

// Base shader for rendering points

export default (gl, vsSource, fsSource) => {
    let numComponents = 2;

    const positionBuffer = buffer(gl);

    let lastColor = [-1, -1, -1, -1];

    const shaderProgram = initShaders(gl, vsSource, fsSource);
    const vertexLocation = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
    const offsetLocation = gl.getUniformLocation(shaderProgram, 'uOffset');
    const scaleLocation = gl.getUniformLocation(shaderProgram, 'uScale');
    const seriesColorLocation = gl.getUniformLocation(shaderProgram, 'uSeriesColor');

    const draw = (positions, color, mode = gl.TRIANGLES) => {
        const fColor = color || [0.0, 0.0, 0.0, 0.0];
        if (fColor.some((c, i) => c !== lastColor[i])) {
            setColor(fColor);
        }

        positionBuffer(positions);
        drawBuffers(positions.length / numComponents, mode);
    };

    draw.activate = () => {
        setupProgram();
        lastColor = [-1, -1, -1, -1];
    };

    draw.setModelView = ({offset, scale}) => {
        gl.uniform2fv(
            offsetLocation,
            offset);
        gl.uniform2fv(
            scaleLocation,
            scale);
    };

    draw.shaderProgram = () => shaderProgram;

    draw.numComponents = (...args) => {
        if (!args.length) {
            return numComponents;
        }
        numComponents = args[0];
        return draw;
    };

    function setupProgram() {
        // Tell WebGL to use our program when drawing
        gl.useProgram(shaderProgram);

        // Tell WebGL how to pull out the positions from the position
        // buffer into the vertexPosition attribute.
        {
            const type = gl.FLOAT;    // the data in the buffer is 32bit floats
            const normalize = false;  // don't normalize
            const stride = 0;         // how many bytes to get from one set of values to the next
            // 0 = use type and numComponents above
            const offset = 0;         // how many bytes inside the buffer to start from
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer.addr());
            gl.vertexAttribPointer(
                vertexLocation,
                numComponents,
                type,
                normalize,
                stride,
                offset);
            gl.enableVertexAttribArray(vertexLocation);
        }
    }

    function setColor(color) {
        gl.uniform4fv(
            seriesColorLocation,
            color);
    }

    function drawBuffers(vertexCount, mode) {
        {
            const offset = 0;
            gl.drawArrays(mode, offset, vertexCount);
        }
    }

    return draw;
};
