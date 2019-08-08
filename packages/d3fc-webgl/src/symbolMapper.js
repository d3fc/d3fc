import d3Shape from 'd3-shape';
import circlePointShader from './shaders/point/circle/baseShader';
import squarePointShader from './shaders/point/square/shader';
import trianglePointShader from './shaders/point/triangle/shader';
import crossPointShader from './shaders/point/cross/shader';

export default symbol => {
    switch (symbol) {
        case d3Shape.symbolCircle:
            return circlePointShader();
        case d3Shape.symbolSquare:
            return squarePointShader();
        case d3Shape.symbolTriangle:
            return trianglePointShader();
        case d3Shape.symbolCross:
            return crossPointShader();
        default:
            throw new Error(`Unrecognised symbol: ${symbol}`);
    }
};
