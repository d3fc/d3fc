import attributeBuilder from '../buffers/attributeBuilder';
import uniformBuilder from '../buffers/uniformBuilder';
import glScaleBase from '../scale/glScaleBase';
import programBuilder from '../program/programBuilder';
import drawModes from '../program/drawModes';
import areaShader from '../shaders/area/shader';
import { rebind } from '@d3fc/d3fc-rebind';

export default () => {
  let program = programBuilder();
  let xScale = glScaleBase();
  let yScale = glScaleBase();
  let decorate = () => {};

  const xValueAttrib = 'aXValue';
  const xPreviousValueAttrib = 'aXPrevValue';
  const yValueAttrib = 'aYValue';
  const yPreviousValueAttrib = 'aYPrevValue';
  const y0ValueUniform = 'uY0Value';
  const cornerValueAttrib = 'aCorner';
  const definedAttrib = 'aDefined';

  const verticesPerElement = 6;

  const draw = (numElements) => {
    const shaderBuilder = areaShader();
    program.vertexShader(shaderBuilder.vertex())
      .fragmentShader(shaderBuilder.fragment())
      .mode(drawModes.TRIANGLES);

    xScale.coordinate(0);
    xScale(program);
    yScale.coordinate(1);
    yScale(program);

    initCornerArray(numElements);
    setColors(numElements);

    decorate(program);

    program((numElements - 1) * verticesPerElement);
  };

  draw.xValues = (...args) => {
    const xBuffer = program.buffers().attribute(xValueAttrib);
    const xPreviousBuffer = program.buffers().attribute(xPreviousValueAttrib);
    let xArray = new Float32Array((args[0].length - 1) * verticesPerElement);
    let xPreviousArray = new Float32Array((args[0].length - 1) * verticesPerElement);
    
    xArray = xArray.map((_, i) => args[0][Math.floor((i + verticesPerElement) / verticesPerElement)]);
    xPreviousArray = xPreviousArray.map((_, i) => args[0][Math.floor(i / verticesPerElement)]);

    if (xBuffer) {
      xBuffer.data(xArray);
      xPreviousBuffer.data(xPreviousArray);
    } else {
      program.buffers().attribute(xValueAttrib, attributeBuilder(xArray).components(1));
      program.buffers().attribute(xPreviousValueAttrib, attributeBuilder(xPreviousArray).components(1));
    }
    return draw;
  };

  draw.yValues = (...args) => {
    const yBuffer = program.buffers().attribute(yValueAttrib);
    const yPreviousBuffer = program.buffers().attribute(yPreviousValueAttrib);
    let yArray = new Float32Array((args[0].length - 1) * verticesPerElement);
    let yPreviousArray = new Float32Array((args[0].length - 1) * verticesPerElement);

    yArray = yArray.map((_, i) => args[0][Math.floor((i + verticesPerElement) / verticesPerElement)]);
    yPreviousArray = yPreviousArray.map((_, i) => args[0][Math.floor(i / verticesPerElement)]);

    if (yBuffer) {
      yBuffer.data(yArray);
      yPreviousBuffer.data(yPreviousArray);
    } else {
      program.buffers().attribute(yValueAttrib, attributeBuilder(yArray).components(1));
      program.buffers().attribute(yPreviousValueAttrib, attributeBuilder(yPreviousArray).components(1));
    }
    return draw;
  };

  draw.y0Value = (...args) => {
    const y0Buffer = program.buffers().uniform(y0ValueUniform);
    if (y0Buffer) {
      y0Buffer.data(args[0]);
    } else {
      program.buffers().uniform(y0ValueUniform, uniformBuilder(args[0]));
    }
    return draw;
  };

  draw.defined = (...args) => {
    const definedBuffer = program.buffers().attribute(definedAttrib);

    const definedArray = new Float32Array((args[0].length - 1) * verticesPerElement);
    const values = args[0];

    for (let i = 0; i < values.length - 1; i += 1) {
      const bufferIndex = i * verticesPerElement;
      const value = values[i] ? values[i + 1] : values[i];

      definedArray[bufferIndex] = definedArray[bufferIndex + 1] = definedArray[bufferIndex + 2] =
        definedArray[bufferIndex + 3] = definedArray[bufferIndex + 4] = definedArray[bufferIndex + 5] = value;
    }

    if (definedBuffer) {
      definedBuffer.data(definedArray);
    } else {
      program.buffers().attribute(definedAttrib, attributeBuilder(definedArray).components(1));
    }
    return draw;
  };

  draw.decorate = (...args) => {
    if (!args.length) {
      return decorate;
    }
    decorate = args[0];
    return draw;
  };

  draw.xScale = (...args) => {
    if (!args.length) {
      return xScale;
    }
    xScale = args[0];
    return draw;
  };

  draw.yScale = (...args) => {
    if (!args.length) {
      return yScale;
    }
    yScale = args[0];
    return draw;
  };

  const initCornerArray = (numElements) => {
    const cornerBuffer = program.buffers().attribute(cornerValueAttrib);
    const cornerValues = [0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 1, 1];

    let cornerArray = new Float32Array((numElements - 1) * verticesPerElement * 2);
    cornerArray = cornerArray.map((_, i) => cornerValues[i % 12]);

    if (cornerBuffer) {
      cornerBuffer.data(cornerArray);
    } else {
      program.buffers().attribute(cornerValueAttrib, attributeBuilder(cornerArray).components(2));
    }
  };

  const setColors = (numElements) => {
    const colorBuffer = program.buffers().attribute('aColor');
    const red = [1, 0, 0, 0.5];
    const blue = [0, 0, 1, 0.5];
    const colors = [...red, ...red, ...red, ...blue, ...blue, ...blue];

    let colorArray = new Float32Array((numElements - 1) * verticesPerElement * 4);
    colorArray = colorArray.map((_, i) => colors[i % (verticesPerElement * 4)]);

    if (colorBuffer) {
      colorBuffer.data(colorArray);
    } else {
      program.buffers().attribute('aColor', attributeBuilder(colorArray).components(4));
    }
  };

  rebind(draw, program, 'context');

  return draw;
};
