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
        .appendHeader(vertexShaderSnippets.area.header)
        .appendBody(vertexShaderSnippets.area.body);

    fragmentShader
        .appendHeader(fragmentShaderSnippets.area.header)
        .appendBody(fragmentShaderSnippets.area.body);

    return {
        vertex: () => vertexShader,
        fragment: () => fragmentShader
    };
};
