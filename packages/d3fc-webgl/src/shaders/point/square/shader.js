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
        .appendHeader(vertexShaderSnippets.square.header)
        .appendBody(vertexShaderSnippets.square.body);
    fragmentShader
        .appendHeader(fragmentShaderSnippets.square.header)
        .appendBody(fragmentShaderSnippets.square.body);

    return {
        vertex: () => vertexShader,
        fragment: () => fragmentShader
    };
};
