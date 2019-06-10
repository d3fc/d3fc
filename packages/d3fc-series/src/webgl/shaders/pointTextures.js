import {rebindAll, exclude} from '@d3fc/d3fc-rebind';
import pointsBase from './pointsBase';

// Shader program to draw circles at points

// Vertex shader program
const vsSource = `
precision lowp float;
attribute vec4 aVertexPosition;

uniform vec2 uOffset;
uniform vec2 uScale;
uniform float uLineWidth;

varying float vSize;

void main() {
    vec2 vertex = vec2(aVertexPosition[0], aVertexPosition[1]);
    vec2 clipSpace = 2.0 * (vertex - uOffset) / uScale - 1.0;

    vSize = sqrt(aVertexPosition[2]) * 2.0 + uLineWidth / 2.0;
    gl_PointSize = vSize + 1.0;
    gl_Position = vec4(clipSpace, 0.0, 1.0);
}`;

const fsSource = `
precision lowp float;

uniform float uLineWidth;
uniform vec4 uEdgeColor;
uniform vec4 uSeriesColor;
uniform sampler2D uSampler;

varying float vSize;

bool edge(vec2 coord) {
    float w = uLineWidth / vSize;
    vec4 tex1 = texture2D(uSampler, coord + vec2(0, w), -0.5);
    vec4 tex2 = texture2D(uSampler, coord + vec2(0, -w), -0.5);
    vec4 tex3 = texture2D(uSampler, coord + vec2(w, 0), -0.5);
    vec4 tex4 = texture2D(uSampler, coord + vec2(-w, 0), -0.5);

    return (tex1[3] + tex2[3] + tex3[3] + tex4[3]) < 3.8;
}

void main() {
    float edgeAlpha = texture2D(uSampler, gl_PointCoord, -0.5)[3];

    if (uLineWidth < 0.1) {
        gl_FragColor = uSeriesColor * edgeAlpha;
    } else {
        if (edge(gl_PointCoord)) {
            gl_FragColor = uEdgeColor * edgeAlpha;
        } else {
            gl_FragColor = uSeriesColor;
        }
    }
}`;

export default (gl) => {
    const base = pointsBase(gl, vsSource, fsSource);

    const texture = gl.createTexture();
    const samplerLocation = gl.getUniformLocation(base.shaderProgram, 'uSampler');

    const draw = (positions, image, color, lineWidth = 0, strokeColor = null) => {
        setupTexture(image);

        base(positions, color, lineWidth, strokeColor);
    };

    function setupTexture(image) {
        // Tell WebGL we want to affect texture unit 0
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

        // WebGL1 has different requirements for power of 2 images
        // vs non power of 2 images so check if the image is a
        // power of 2 in both dimensions.
        if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
            // Yes, it's a power of 2. Generate mips.
            gl.generateMipmap(gl.TEXTURE_2D);
        } else {
            // No, it's not a power of 2. Turn off mips and set
            // wrapping to clamp to edge
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        }

        // Tell the shader we bound the texture to texture unit 0
        gl.uniform1i(samplerLocation, 0);
    };

    rebindAll(draw, base, exclude('shaderProgram'));
    return draw;
};

function isPowerOf2(value) {
    return (value & (value - 1)) === 0;
}
