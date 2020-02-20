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
            aCrossNextValue: 1,
            aMainNextValue: 5,
            aCrossNextNextValue: 2,
            aMainNextNextValue: 4,
            aCrossValue: 0,
            aMainValue: 4,
            aCrossPrevValue: 0,
            aMainPrevValue: 4,
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
            aCrossNextValue: 2,
            aMainNextValue: 4,
            aCrossNextNextValue: 3,
            aMainNextNextValue: 5,
            aCrossValue: 1,
            aMainValue: 5,
            aCrossPrevValue: 0,
            aMainPrevValue: 4,
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
            aCrossNextValue: 8,
            aMainNextValue: 5,
            aCrossNextNextValue: 8,
            aMainNextNextValue: 5,
            aCrossValue: 7,
            aMainValue: 4,
            aCrossPrevValue: 6,
            aMainPrevValue: 5,
            aDefined: 1
        };

        expectVertexShader(
            shaders.vertexShader(),
            attributes,
            uniforms
        ).toHaveGlPosition([7, 3.9911, 0, 1]);
    });
});
