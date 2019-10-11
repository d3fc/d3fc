import attributeBuilder from '../buffers/attributeBuilder';
import glScaleBase from '../scale/glScaleBase';
import programBuilder from '../program/programBuilder';
import ohlcShader from '../shaders/ohlc/shader';
import drawModes from '../program/drawModes';
import functor from '../functor';
import { rebind } from '@d3fc/d3fc-rebind';

export default () => {
  let program = programBuilder();
  let xScale = glScaleBase();
  let yScale = glScaleBase();
  let decorate = () => {};
  let x = null;
  let open = null;
  let high = null;
  let low = null;
  let close = null;
  let bandwidth = null;
  let lineWidth = null;

  const xValueAttrib = 'aXValue';
  const yValueAttrib = 'aYValue';
  const xLineWidthAttrib = 'aXLineWidth';
  const yLineWidthAttrib = 'aYLineWidth';
  const bandwidthAttrib = 'aBandwidth';
  const colorAttrib = 'aColor';

  const draw = (numElements) => {
    const shaderBuilder = ohlcShader();
    program.vertexShader(shaderBuilder.vertex())
      .fragmentShader(shaderBuilder.fragment())
      .mode(drawModes.TRIANGLES);

    xScale.coordinate(0);
    xScale(program);
    yScale.coordinate(1);
    yScale(program);

    decorate(program);

    const buffers = buildBuffers(x, open, high, low, close, bandwidth, lineWidth, numElements);

    program(numElements);
  };

  draw.x = (...args) => {
    if (!args.length) {
      return x;
    }
    x = args[0];
    return draw;
  };

  draw.open = (...args) => {
    if (!args.length) {
      return open;
    }
    open = args[0];
    return draw;
  };

  draw.high = (...args) => {
    if (!args.length) {
      return high;
    }
    high = args[0];
    return draw;
  };

  draw.low = (...args) => {
    if (!args.length) {
      return low;
    }
    low = args[0];
    return draw;
  };

  draw.close = (...args) => {
    if (!args.length) {
      return close;
    }
    close = args[0];
    return draw;
  };

  draw.bandwidth = (...args) => {
    if (!args.length) {
      return bandwidth;
    }
    bandwidth = args[0];
    return draw;
  };

  draw.lineWidth = (...args) => {
    if (!args.length) {
      return lineWidth;
    }
    lineWidth = args[0];
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

  const buildBuffers = (x, open, high, low, close, bandwidth, lineWidth, numElements) => {
    const buffers = {
      x: [],
      y: [],
      xLineWidth: [],
      yLineWidth: [],
      bandwidth: [],
      colors: []
    };

    for (let i = 0; i < numElements; i += 1) {
      const xi = x[i];
      const openi = open[i];
      const highi = high[i];
      const lowi = low[i];
      const closei = close[i];
      const bandwidthi = bandwidth[i];
      const lineWidthi = lineWidth[i];

      // Low to High bar
    }

    const addToBuffers = (xBuf, yBuf, xLineWidthBuf, yLineWidthBuf, bandwidthBuf) => {
      buffers.x.push(xBuf);
      buffers.y.push(yBuf);
      buffers.xLineWidth.push(-lineWidthi);
      buffers.yLineWidth.push(0);
      buffers.bandwidth.push(0);
    };
  };

  rebind(draw, program, 'context');

  return draw;
};
