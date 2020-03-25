import {
    symbolCircle,
    symbolSquare,
    symbolTriangle,
    symbolCross,
    symbolDiamond,
    symbolStar,
    symbolWye
} from 'd3-shape';
import circlePointShader from './shaders/point/circle/baseShader';
import squarePointShader from './shaders/point/square/shader';
import trianglePointShader from './shaders/point/triangle/shader';
import crossPointShader from './shaders/point/cross/shader';
import diamondPointShader from './shaders/point/diamond/shader';
import starPointShader from './shaders/point/star/shader';
import wyePointShader from './shaders/point/wye/shader';

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
        case symbolStar:
            return starPointShader();
        case symbolWye:
            return wyePointShader();
        default:
            throw new Error(`Unrecognised symbol: ${symbol}`);
    }
};
