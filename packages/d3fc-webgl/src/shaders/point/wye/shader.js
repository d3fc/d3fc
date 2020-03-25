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
        .appendHeader(vertexShaderSnippets.wye.header)
        .appendBody(vertexShaderSnippets.wye.body);
    fragmentShader
        .appendHeader(fragmentShaderSnippets.wye.header)
        .appendBody(fragmentShaderSnippets.wye.body);

    return {
        vertex: () => vertexShader,
        fragment: () => fragmentShader
    };
};
