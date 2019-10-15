import d3Shape from 'd3-shape';
import circlePointShader from './shaders/point/circle/baseShader';
import squarePointShader from './shaders/point/square/shader';

export default (symbol) => {
  switch (symbol) {
    case d3Shape.symbolCircle:
      return circlePointShader();
    case d3Shape.symbolSquare:
      return squarePointShader();
    default:
      throw new Error(`Unrecognised symbol: ${symbol}`);
  }
};
