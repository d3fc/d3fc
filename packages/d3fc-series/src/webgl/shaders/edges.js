import initShaders from '../helper/initShaders';
import buffer from '../helper/buffer';

// Shader program to use position and edge arrays to draw triangles that
// have a border line in a different color

// Vertex shader program
const vsSource = `
  attribute vec4 aVertexPosition;
  attribute vec4 aVertexEdge;

  uniform vec2 uOffset;
  uniform vec2 uScale;

  varying lowp vec4 vEdge;

  void main() {
    vec2 vertex = vec2(aVertexPosition[0], aVertexPosition[1]);
    vec2 clipSpace = 2.0 * (vertex - uOffset) / uScale - 1.0;

    gl_Position = vec4(clipSpace, 0.0, 1.0);
    vEdge = aVertexEdge;
  }
`;

const fsSource = `
  precision mediump float;

  varying lowp vec4 vEdge;

  uniform vec4 uEdgeColor;
  uniform vec4 uSeriesColor;

  void main() {
    lowp float r = clamp(vEdge[1] - vEdge[0], 0.0, 1.0);
    gl_FragColor = r * uSeriesColor + (1.0 - r) * uEdgeColor;
  }
`;

export default (gl) => {
    const positionBuffer = buffer(gl);
    const edgeBuffer = buffer(gl);
    const buffers = {
        position: positionBuffer.addr(),
        edges: edgeBuffer.addr()
    };

    let lastColor = [-1, -1, -1, -1];
    let lastStrokeColor = [-1, -1, -1, -1];
    const draw = (positions, edges, color, strokeColor = null) => {
        positionBuffer(positions);
        edgeBuffer(edges);

        const sColor = strokeColor || color;
        if (color.some((c, i) => c !== lastColor[i]) || sColor.some((c, i) => c !== lastStrokeColor[i])) {
            setColor(color, sColor);
            lastColor = color;
            lastStrokeColor = sColor;
        }

        drawBuffers(positions.length / 2);
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
            vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
            vertexEdge: gl.getAttribLocation(shaderProgram, 'aVertexEdge')
        },
        uniformLocations: {
            offset: gl.getUniformLocation(shaderProgram, 'uOffset'),
            scale: gl.getUniformLocation(shaderProgram, 'uScale'),
            seriesColor: gl.getUniformLocation(shaderProgram, 'uSeriesColor'),
            edgeColor: gl.getUniformLocation(shaderProgram, 'uEdgeColor')
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

        // Tell WebGL how to pull out the edges from the buffer
        {
            const numComponents = 2;  // pull out 2 values per iteration
            const type = gl.FLOAT;    // the data in the buffer is 32bit floats
            const normalize = false;  // don't normalize
            const stride = 0;         // how many bytes to get from one set of values to the next
            // 0 = use type and numComponents above
            const offset = 0;         // how many bytes inside the buffer to start from
            gl.bindBuffer(gl.ARRAY_BUFFER, buffers.edges);
            gl.vertexAttribPointer(
                programInfo.attribLocations.vertexEdge,
                numComponents,
                type,
                normalize,
                stride,
                offset);
            gl.enableVertexAttribArray(
                programInfo.attribLocations.vertexEdge);
        }
    }

    function setColor(color, strokeColor) {
        gl.uniform4fv(
            programInfo.uniformLocations.seriesColor,
            color);
        gl.uniform4fv(
            programInfo.uniformLocations.edgeColor,
            strokeColor);
    }

    function drawBuffers(vertexCount) {
        {
            const offset = 0;
            gl.drawArrays(gl.TRIANGLES, offset, vertexCount);
        }
    }

    return draw;
};
