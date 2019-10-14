import shaderBuilder, { vertexShaderBase, fragmentShaderBase } from '../shaderBuilder';
import * as vertexShaderSnippets from '../vertexShaderSnippets';
import * as fragmentShaderSnippets from '../fragmentShaderSnippets';

export default () => {
  const vertexShader = shaderBuilder(vertexShaderBase);
  const fragmentShader = shaderBuilder(fragmentShaderBase);

  vertexShader
    .appendHeader(`
      attribute float aXValue;
      attribute float aYValue;
      attribute float aXLineWidth;
      attribute float aYLineWidth;
      attribute float aBandwidth;
    `)
    .appendHeader(vertexShaderSnippets.multiColor.header)
    .appendBody(`
      vec4 xOffset = vec4((aXLineWidth / 2.0) + (aBandwidth / 2.0), 0, 0, 0);
      vec4 yOffset = vec4(0, (aYLineWidth / 2.0), 0, 0);
      gl_Position = vec4(aXValue + xOffset.x, aYValue + yOffset.y, 0, 1);
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
