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
        .appendHeader(vertexShaderSnippets.bar.header)
        .appendBody(vertexShaderSnippets.bar.body);

    fragmentShader
        .appendHeader(fragmentShaderSnippets.bar.header)
        .appendBody(fragmentShaderSnippets.bar.body);

    return {
        vertex: () => vertexShader,
        fragment: () => fragmentShader
    };
};
