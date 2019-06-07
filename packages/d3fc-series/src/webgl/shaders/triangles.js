import initShaders from '../helper/initShaders';
import buffer from '../helper/buffer';

// Shader program to draw filled triangles

// Vertex shader program
const vsSource = `
  attribute vec4 aVertexPosition;

  uniform vec2 uOffset;
  uniform vec2 uScale;

  void main() {
    vec2 vertex = vec2(aVertexPosition[0], aVertexPosition[1]);
    vec2 clipSpace = 2.0 * (vertex - uOffset) / uScale - 1.0;
    gl_Position = vec4(clipSpace, 0.0, 1.0);
  }
`;

const fsSource = `
  precision mediump float;
  uniform vec4 uSeriesColor;

  void main() {
    gl_FragColor = uSeriesColor;
  }
`;

// Available modes:
// gl.TRIANGLES
// gl.TRIANGLE_STRIP
// gl.TRIANGLE_FAN
export default (gl) => {
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

    draw.setModelView = ({offset, scale}) => {
        gl.uniform2fv(
            programInfo.uniformLocations.offset,
            offset);
        gl.uniform2fv(
            programInfo.uniformLocations.scale,
            scale);
    };

    const shaderProgram = initShaders(gl, vsSource, fsSource);
    const programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition')
        },
        uniformLocations: {
            offset: gl.getUniformLocation(shaderProgram, 'uOffset'),
            scale: gl.getUniformLocation(shaderProgram, 'uScale'),
            seriesColor: gl.getUniformLocation(shaderProgram, 'uSeriesColor')
        }
    };

    function setupProgram(buffers) {
        // Tell WebGL to use our program when drawing
        gl.useProgram(programInfo.program);

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
