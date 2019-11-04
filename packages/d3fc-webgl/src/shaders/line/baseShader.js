import shaderBuilder, { vertexShaderBase, fragmentShaderBase } from '../shaderBuilder';

export default () => {
    const vertexShader = shaderBuilder(vertexShaderBase);
    const fragmentShader = shaderBuilder(fragmentShaderBase);

    vertexShader
        .appendHeader(`uniform float uWidth;`) // defines the width of the line
        .appendHeader(`uniform vec2 uScreen;`) // the screen space canvas size (for normalizing vectors)
        .appendHeader(`attribute vec2 aCorner;`) // defines which vertex in the line join we are considering
        .appendHeader(`attribute float aXValue; attribute float aYValue;`) // the current vertex positions
        .appendHeader(`attribute float aNextXValue; attribute float aNextYValue;`) // the next vertex positions
        .appendHeader(`attribute float aPrevXValue; attribute float aPrevYValue;`) // the previous vertex positions
        .appendHeader(`attribute float aDefined;`)
        .appendHeader(`varying float vDefined;`)
        .appendBody(`vDefined = aDefined;`)
        .appendBody(`vec4 curr = vec4(aXValue, aYValue, 0, 1);`)
        .appendBody(`gl_Position = curr;`)
        .appendBody(`vec4 next = vec4(aNextXValue, aNextYValue, 0, 0);`)
        .appendBody(`vec4 prev = vec4(aPrevXValue, aPrevYValue, 0, 0);`);

    fragmentShader
        .appendHeader(`varying float vDefined;`)
        .appendBody(`if (vDefined < 0.5) {
            discard;
            return;
        }`);

    return {
        vertex: () => vertexShader,
        fragment: () => fragmentShader
    };
};
