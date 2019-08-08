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
        .appendHeader(vertexShaderSnippets.rect.header)
        .appendBody(vertexShaderSnippets.rect.body);

    fragmentShader
        .appendHeader(fragmentShaderSnippets.rect.header)
        .appendBody(fragmentShaderSnippets.rect.body);

    return {
        vertex: () => vertexShader,
        fragment: () => fragmentShader
    };
};
