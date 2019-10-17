import shaderBuilder, { vertexShaderBase, fragmentShaderBase } from '../shaderBuilder';
import * as vertexShaderSnippets from '../vertexShaderSnippets';
import * as fragmentShaderSnippets from '../fragmentShaderSnippets';

export default () => {
  const vertexShader = shaderBuilder(vertexShaderBase);
  const fragmentShader = shaderBuilder(fragmentShaderBase);

  vertexShader
    .appendHeader(`
      uniform vec2 uScreen;
      attribute float aXValue;
      attribute float aYValue;
      attribute float aXLineWidth;
      attribute float aYLineWidth;
      attribute float aBandwidth;
    `)
    .appendHeader(vertexShaderSnippets.multiColor.header)
    .appendBody(`
      gl_Position = vec4(aXValue, aYValue, 0, 1);
    `)
    .appendBody(vertexShaderSnippets.multiColor.body);

  fragmentShader
    .appendHeader(fragmentShaderSnippets.multiColor.header)
    .appendBody(fragmentShaderSnippets.multiColor.body);

  return {
    vertex: () => vertexShader,
    fragment: () => fragmentShader
  };
};
