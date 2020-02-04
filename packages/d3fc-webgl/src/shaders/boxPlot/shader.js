import shaderBuilder, {
    vertexShaderBase,
    fragmentShaderBase
} from '../shaderBuilder';
import * as vertexShaderSnippets from '../vertexShaderSnippets';
import * as fragmentShaderSnippets from '../fragmentShaderSnippets';

export default () => {
    const vertexShader = shaderBuilder(vertexShaderBase);
    const fragmentShader = shaderBuilder(fragmentShaderBase);

    vertexShader
        .appendHeader(vertexShaderSnippets.boxPlot.header)
        .appendBody(vertexShaderSnippets.boxPlot.body);

    fragmentShader
        .appendHeader(fragmentShaderSnippets.boxPlot.header)
        .appendBody(fragmentShaderSnippets.boxPlot.body);

    return {
        vertex: () => vertexShader,
        fragment: () => fragmentShader
    };
};
