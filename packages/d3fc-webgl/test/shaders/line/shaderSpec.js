import * as fc from '../../../index';
import { expectVertexShader, getShaders } from '../../util/vertextShaderUtil';

describe('glLine', () => {
    const line = fc
        .webglSeriesLine()
        .xScale(fc.webglScaleLinear())
        .yScale(fc.webglScaleLinear());

    const shaders = getShaders(line);

    const uniforms = {
        uScreen: [500, 250],
        uStrokeWidth: 2,
        linear0Offset: [0, 0, 0, 0],
        linear0Scale: [1, 1, 1, 1],
        linear1Offset: [0, 0, 0, 0],
        linear1Scale: [1, 1, 1, 1]
    };

    it('correctly positions the first point in a series', () => {
        const attributes = {
            aCorner: [-1, 0, 0],
            aCrossValue: 1,
            aMainValue: 5,
            aCrossNextValue: 2,
            aMainNextValue: 4,
            aCrossPrevValue: 0,
            aMainPrevValue: 4,
            aCrossPrevPrevValue: 0,
            aMainPrevPrevValue: 4,
            aDefined: 1
        };

        expectVertexShader(
            shaders.vertexShader(),
            attributes,
            uniforms
        ).toHaveGlPosition([0.0018, 3.9928, 0, 1]);
    });

    it('correctly positions a point in the middle of a series', () => {
        const attributes = {
            aCorner: [-1, 0, 0],
            aCrossValue: 2,
            aMainValue: 4,
            aCrossNextValue: 3,
            aMainNextValue: 5,
            aCrossPrevValue: 1,
            aMainPrevValue: 5,
            aCrossPrevPrevValue: 0,
            aMainPrevPrevValue: 4,
            aDefined: 1
        };

        expectVertexShader(
            shaders.vertexShader(),
            attributes,
            uniforms
        ).toHaveGlPosition([1, 4.9911, 0, 1]);
    });

    it('correctly positions the last point in a series', () => {
        const attributes = {
            aCorner: [-1, 0, 0],
            aCrossValue: 8,
            aMainValue: 5,
            aCrossNextValue: 8,
            aMainNextValue: 5,
            aCrossPrevValue: 7,
            aMainPrevValue: 4,
            aCrossPrevPrevValue: 6,
            aMainPrevPrevValue: 5,
            aDefined: 1
        };

        expectVertexShader(
            shaders.vertexShader(),
            attributes,
            uniforms
        ).toHaveGlPosition([7, 3.9911, 0, 1]);
    });
});
