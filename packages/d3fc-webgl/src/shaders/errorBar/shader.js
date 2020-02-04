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
        .appendHeader(vertexShaderSnippets.errorBar.header)
        .appendBody(vertexShaderSnippets.errorBar.body);

    fragmentShader
        .appendHeader(fragmentShaderSnippets.errorBar.header)
        .appendBody(fragmentShaderSnippets.errorBar.body);

    return {
        vertex: () => vertexShader,
        fragment: () => fragmentShader
    };
};
