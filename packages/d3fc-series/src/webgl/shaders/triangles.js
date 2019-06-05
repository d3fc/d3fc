import initShaders from '../helper/initShaders';
import buffer from '../helper/buffer';

// Shader program to draw filled triangles

// Vertex shader program
const vsSource = `
  attribute vec4 aVertexPosition;

  uniform vec4 uSeriesColor;

  uniform mat4 uModelViewMatrix;
  uniform mat4 uProjectionMatrix;

  varying lowp vec4 vColor;

  void main() {
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    vColor = uSeriesColor;
  }
`;

const fsSource = `
  varying lowp vec4 vColor;

  void main() {
    gl_FragColor = vColor;
  }
`;

// Available modes:
// gl.TRIANGLES
// gl.TRIANGLE_STRIP
// gl.TRIANGLE_FAN
export default (gl, projectionMatrix, modelViewMatrix) => {
    const positionBuffer = buffer(gl);
    const buffers = {
        position: positionBuffer.addr()
    };

    let lastColor = [-1, -1, -1, -1];
    const draw = (positions, color, mode = gl.TRIANGLES) => {
        positionBuffer(positions);

        if (color.some((c, i) => c !== lastColor[i])) {
            setColor(color);
            lastColor = color;
        }
        drawBuffers(positions.length / 2, mode);
    };

    draw.activate = () => {
        setupProgram(buffers);
        lastColor = [-1, -1, -1, -1];
    };

    const shaderProgram = initShaders(gl, vsSource, fsSource);
    const programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition')
        },
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
            modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
            seriesColor: gl.getUniformLocation(shaderProgram, 'uSeriesColor')
        }
    };

    function setupProgram(buffers) {
        // Tell WebGL to use our program when drawing
        gl.useProgram(programInfo.program);

        // Set the shader uniforms
        gl.uniformMatrix4fv(
            programInfo.uniformLocations.projectionMatrix,
            false,
            projectionMatrix);
        gl.uniformMatrix4fv(
            programInfo.uniformLocations.modelViewMatrix,
            false,
            modelViewMatrix);

        // Tell WebGL how to pull out the positions from the position
        // buffer into the vertexPosition attribute.
        {
            const numComponents = 2;  // pull out 2 values per iteration
            const type = gl.FLOAT;    // the data in the buffer is 32bit floats
            const normalize = false;  // don't normalize
            const stride = 0;         // how many bytes to get from one set of values to the next
            // 0 = use type and numComponents above
            const offset = 0;         // how many bytes inside the buffer to start from
            gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
            gl.vertexAttribPointer(
                programInfo.attribLocations.vertexPosition,
                numComponents,
                type,
                normalize,
                stride,
                offset);
            gl.enableVertexAttribArray(
                programInfo.attribLocations.vertexPosition);
        }
    }

    function setColor(color) {
        gl.uniform4fv(
            programInfo.uniformLocations.seriesColor,
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
