import shaderBuilder, { vertexShaderBase, fragmentShaderBase } from '../shaderBuilder';
import * as vertexShaderSnippets from '../vertexShaderSnippets';
import * as fragmentShaderSnippets from '../fragmentShaderSnippets';

export default () => {
  const vertexShader = shaderBuilder(vertexShaderBase);
  const fragmentShader = shaderBuilder(fragmentShaderBase);

  vertexShader
    .appendHeader(vertexShaderSnippets.ohlc.header)
    .appendHeader(vertexShaderSnippets.multiColor.header)
    .appendBody(vertexShaderSnippets.ohlc.body)
    .appendBody(vertexShaderSnippets.multiColor.body);

  fragmentShader
    .appendHeader(fragmentShaderSnippets.multiColor.header)
    .appendBody(fragmentShaderSnippets.multiColor.body);

  return {
    vertex: () => vertexShader,
    fragment: () => fragmentShader
  };
};
