import shaderBuilder, {
    vertexShaderBase,
    fragmentShaderBase
} from '../shaderBuilder';
import * as vertexShaderSnippets from '../vertexShaderSnippets';

export default () => {
    const vertexShader = shaderBuilder(vertexShaderBase);
    const fragmentShader = shaderBuilder(fragmentShaderBase);

    vertexShader
        .appendHeader(vertexShaderSnippets.boxPlot.header)
        .appendBody(vertexShaderSnippets.boxPlot.body);

    return {
        vertex: () => vertexShader,
        fragment: () => fragmentShader
    };
};
