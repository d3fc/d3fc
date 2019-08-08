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
        .appendHeader(vertexShaderSnippets.circle.header)
        .appendBody(vertexShaderSnippets.circle.body);
    fragmentShader
        .appendHeader(fragmentShaderSnippets.circle.header)
        .appendBody(fragmentShaderSnippets.circle.body);

    return {
        vertex: () => vertexShader,
        fragment: () => fragmentShader
    };
};
