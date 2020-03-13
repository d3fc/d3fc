import {
    symbolCircle,
    symbolSquare,
    symbolTriangle,
    symbolCross,
    symbolDiamond
} from 'd3-shape';
import circlePointShader from './shaders/point/circle/baseShader';
import squarePointShader from './shaders/point/square/shader';
import trianglePointShader from './shaders/point/triangle/shader';
import crossPointShader from './shaders/point/cross/shader';
import diamondPointShader from './shaders/point/diamond/shader';

export default symbol => {
    switch (symbol) {
        case symbolCircle:
            return circlePointShader();
        case symbolSquare:
            return squarePointShader();
        case symbolTriangle:
            return trianglePointShader();
        case symbolCross:
            return crossPointShader();
        case symbolDiamond:
            return diamondPointShader();
        default:
            throw new Error(`Unrecognised symbol: ${symbol}`);
    }
};
