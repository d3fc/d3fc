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
        .appendHeader(vertexShaderSnippets.ohlc.header)
        .appendBody(vertexShaderSnippets.ohlc.body);

    fragmentShader
        .appendHeader(fragmentShaderSnippets.ohlc.header)
        .appendBody(fragmentShaderSnippets.ohlc.body);

    return {
        vertex: () => vertexShader,
        fragment: () => fragmentShader
    };
};
