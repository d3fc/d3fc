import shaderBuilder, {
    vertexShaderBase,
    fragmentShaderBase
} from '../../shaderBuilder';
import * as vertexShaderSnippets from '../../vertexShaderSnippets';
import * as fragmentShaderSnippets from '../../fragmentShaderSnippets';

export default () => {
    const vertexShader = shaderBuilder(vertexShaderBase);
    const fragmentShader = shaderBuilder(fragmentShaderBase);
    vertexShader
        .appendHeader(vertexShaderSnippets.triangle.header)
        .appendBody(vertexShaderSnippets.triangle.body);
    fragmentShader
        .appendHeader(fragmentShaderSnippets.triangle.header)
        .appendBody(fragmentShaderSnippets.triangle.body);

    return {
        vertex: () => vertexShader,
        fragment: () => fragmentShader
    };
};
