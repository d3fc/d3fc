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
        .appendHeader(vertexShaderSnippets.diamond.header)
        .appendBody(vertexShaderSnippets.diamond.body);
    fragmentShader
        .appendHeader(fragmentShaderSnippets.diamond.header)
        .appendBody(fragmentShaderSnippets.diamond.body);

    return {
        vertex: () => vertexShader,
        fragment: () => fragmentShader
    };
};
