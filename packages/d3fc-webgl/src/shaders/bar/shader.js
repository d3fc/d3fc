import shaderBuilder, {
    vertexShaderBase,
    fragmentShaderBase
} from '../shaderBuilder';

export default () => {
    const vertexShader = shaderBuilder(vertexShaderBase);
    const fragmentShader = shaderBuilder(fragmentShaderBase);

    vertexShader
        .appendHeader(`attribute float aXValue;`)
        .appendHeader(`attribute float aYValue;`)
        .appendHeader(`attribute float aWidthValue;`)
        .appendHeader(`attribute float aDirection;`)
        .appendBody(`gl_Position = vec4(aXValue, aYValue, 0, 1);`)
        .appendBody(`vec4 origin = vec4(0.0, 0.0, 0.0, 0.0);`)
        .appendBody(`vec4 width = vec4(aWidthValue, 0.0, 0.0, 0.0);`)
        .appendBody(
            `gl_Position.x += (width.x - origin.x) / 2.0 * aDirection;`
        );

    return {
        vertex: () => vertexShader,
        fragment: () => fragmentShader
    };
};
