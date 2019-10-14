import d3Shape from 'd3-shape';
import circlePointShader from './shaders/point/circle/baseShader';
import squarePointShader from './shaders/point/square/baseShader';

export default (symbol) => {
  let glSymbol = null;

  switch (symbol) {
    case d3Shape.symbolCircle:
      glSymbol = circlePointShader();
      break;
    case d3Shape.symbolSquare:
      glSymbol = squarePointShader();
      break;
    default:
      throw new Error(`Unrecognised symbol: ${symbol}`);
  }

  return glSymbol;
};
