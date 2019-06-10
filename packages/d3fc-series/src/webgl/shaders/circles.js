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

    vSize = sqrt(aVertexPosition[2]) + uLineWidth / 2.0;
    gl_PointSize = vSize + 1.0;
    gl_Position = vec4(clipSpace, 0.0, 1.0);
}`;

const fsSource = `
precision lowp float;

uniform float uLineWidth;
uniform vec4 uEdgeColor;
uniform vec4 uSeriesColor;

varying float vSize;

void main() {
    float dist = length(2.0 * gl_PointCoord - 1.0) * vSize;
    float inner = vSize - 2.0 * uLineWidth - 1.0;

    if (dist > vSize + 1.0) {
        discard;
    } else if (uEdgeColor[3] < 0.1) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    } else if (dist < inner) {
        gl_FragColor = uSeriesColor;
    } else {
        float rAlias = clamp((dist - vSize) / 2.0 + 0.5, 0.0, 1.0);
        vec4 transparent = vec4(0.0);
        vec4 edgeColor = rAlias * transparent + (1.0 - rAlias) * uEdgeColor;

        float rEdge = clamp(dist - inner, 0.0, 1.0);
        gl_FragColor = rEdge * edgeColor + (1.0 - rEdge) * uSeriesColor;
    }
}`;

export default gl => {
    const base = pointsBase(gl, vsSource, fsSource);

    const draw = (positions, color, lineWidth = 0, strokeColor = null) => {
        base(positions, color, lineWidth, strokeColor);
    };

    rebindAll(draw, base, exclude('shaderProgram'));
    return draw;
};
