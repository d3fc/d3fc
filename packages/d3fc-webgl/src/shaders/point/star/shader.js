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
        .appendHeader(vertexShaderSnippets.star.header)
        .appendBody(vertexShaderSnippets.star.body);
    fragmentShader
        .appendHeader(fragmentShaderSnippets.star.header)
        .appendBody(fragmentShaderSnippets.star.body);

    return {
        vertex: () => vertexShader,
        fragment: () => fragmentShader
    };
};
