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
        .appendHeader(vertexShaderSnippets.preScaleLine.header)
        .appendBody(vertexShaderSnippets.preScaleLine.body);

    fragmentShader
        .appendHeader(fragmentShaderSnippets.line.header)
        .appendBody(fragmentShaderSnippets.line.body);

    return {
        vertex: () => vertexShader,
        fragment: () => fragmentShader
    };
};
