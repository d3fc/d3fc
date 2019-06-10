import initShaders from '../helper/initShaders';
import buffer from '../helper/buffer';

// Base shader for rendering points

export default (gl, vsSource, fsSource) => {
    const positionBuffer = buffer(gl);

    let lastWidth = -1;
    let lastColor = [-1, -1, -1, -1];
    let lastStrokeColor = [-1, -1, -1, -1];

    const shaderProgram = initShaders(gl, vsSource, fsSource);
    const vertexLocation = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
    const offsetLocation = gl.getUniformLocation(shaderProgram, 'uOffset');
    const scaleLocation = gl.getUniformLocation(shaderProgram, 'uScale');
    const seriesColorLocation = gl.getUniformLocation(shaderProgram, 'uSeriesColor');
    const edgeColorLocation = gl.getUniformLocation(shaderProgram, 'uEdgeColor');
    const lineWidthLocation = gl.getUniformLocation(shaderProgram, 'uLineWidth');

    const draw = (positions, color, lineWidth = 0, strokeColor = null) => {
        const fColor = color || [0.0, 0.0, 0.0, 0.0];
        const sColor = strokeColor || fColor;
        if ((lineWidth !== lastWidth) ||
                fColor.some((c, i) => c !== lastColor[i]) ||
                sColor.some((c, i) => c !== lastStrokeColor[i])) {
            setColor(fColor, lineWidth, sColor);
            lastWidth = lineWidth;
            lastColor = fColor;
            lastStrokeColor = sColor;
        }

        positionBuffer(positions);
        drawBuffers(positions.length / 3);
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

    draw.shaderProgram = shaderProgram;

    function setupProgram() {
        // Tell WebGL to use our program when drawing
        gl.useProgram(shaderProgram);

        // Tell WebGL how to pull out the positions from the position
        // buffer into the vertexPosition attribute.
        {
            const numComponents = 3;  // pull out 3 values per iteration (x/y/size)
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
            gl.enableVertexAttribArray(
                vertexLocation);
        }
    }

    function setColor(color, lineWidth, strokeColor) {
        gl.uniform4fv(
            seriesColorLocation,
            color);
        gl.uniform4fv(
            edgeColorLocation,
            strokeColor);
        gl.uniform1f(
            lineWidthLocation,
            lineWidth);
    }

    function drawBuffers(vertexCount) {
        {
            const offset = 0;
            gl.drawArrays(gl.POINTS, offset, vertexCount);
        }
    }

    return draw;
};
