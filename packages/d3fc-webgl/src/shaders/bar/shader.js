import shaderBuilder, { vertexShaderBase, fragmentShaderBase } from "../shaderBuilder"

export default () => {
    const vertexShader = shaderBuilder(vertexShaderBase)
    const fragmentShader = shaderBuilder(fragmentShaderBase)

    vertexShader.appendHeader(`uniform vec2 uScreen;`)
        .appendHeader(`attribute float aXValue; attribute float aYValue;`)
        .appendHeader(`attribute float aWidthValue;`)
        .appendHeader(`attribute float aDirection;`)
        .appendBody(`gl_Position = vec4(aXValue, aYValue, 0, 1);`)
        .appendBody(`bool shouldMoveLeft = aDirection < 0.5;`)
        .appendBody(`vec4 origin = vec4(0.0, 0.0, 0.0, 0.0);`)
        .appendBody(`vec4 w = vec4(aWidthValue, 0.0, 0.0, 0.0);`)

    return {
        vertex: () => vertexShader,
        fragment: () => fragmentShader
    }
}
