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
        .appendHeader(vertexShaderSnippets.candlestick.header)
        .appendBody(vertexShaderSnippets.candlestick.body);

    fragmentShader
        .appendHeader(fragmentShaderSnippets.candlestick.header)
        .appendBody(fragmentShaderSnippets.candlestick.body);

    return {
        vertex: () => vertexShader,
        fragment: () => fragmentShader
    };
};
