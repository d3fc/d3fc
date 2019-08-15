import shaderBuilder, { vertexShaderBase, fragmentShaderBase } from '../shaderBuilder';
import * as vertexShaderSnippets from '../vertexShaderSnippets';
import * as fragmentShaderSnippets from '../fragmentShaderSnippets';

export default () => {
    const vertexShader = shaderBuilder(vertexShaderBase);
    const fragmentShader = shaderBuilder(fragmentShaderBase);

    vertexShader
        .appendHeader(`uniform float uWidth;`) // defines the width of the line
        .appendHeader(`uniform vec2 uScreen;`) // the screen space canvas size (for normalizing vectors)
        .appendHeader(`attribute float aSide;`) // defines which side of the line we are placing the vertex
        .appendHeader(`attribute float aXValue; attribute float aYValue;`) // the current vertex positions
        .appendHeader(`attribute float aNextXValue; attribute float aNextYValue;`) // the next vertex positions
        .appendHeader(`attribute float aPrevXValue; attribute float aPrevYValue;`) // the previous vertex positions
        .appendBody(`vec4 curr = vec4(aXValue, aYValue, 0, 1);`)
        .appendBody(`gl_Position = curr;`)
        .appendBody(`vec4 next = vec4(aNextXValue, aNextYValue, 0, 0);`)
        .appendBody(`vec4 prev = vec4(aPrevXValue, aPrevYValue, 0, 0);`);

    return {
        vertex: () => vertexShader,
        fragment: () => fragmentShader
    };
};
