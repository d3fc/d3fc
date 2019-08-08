import shaderBuilder, {
    vertexShaderBase,
    fragmentShaderBase
} from '../shaderBuilder';
import * as vertexShaderSnippets from '../vertexShaderSnippets';

export default () => {
    const vertexShader = shaderBuilder(vertexShaderBase);
    const fragmentShader = shaderBuilder(fragmentShaderBase);

    vertexShader
        .appendHeader(vertexShaderSnippets.errorBar.header)
        .appendBody(vertexShaderSnippets.errorBar.body);

    return {
        vertex: () => vertexShader,
        fragment: () => fragmentShader
    };
};
