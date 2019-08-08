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
        .appendHeader(vertexShaderSnippets.cross.header)
        .appendBody(vertexShaderSnippets.cross.body);
    fragmentShader
        .appendHeader(fragmentShaderSnippets.cross.header)
        .appendBody(fragmentShaderSnippets.cross.body);

    return {
        vertex: () => vertexShader,
        fragment: () => fragmentShader
    };
};
