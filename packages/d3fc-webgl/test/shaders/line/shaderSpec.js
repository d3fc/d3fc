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
            aCorner: [-1, +1, 1, 0],
            aCrossNextValue: 1,
            aMainNextValue: 5,
            aCrossValue: 0,
            aMainValue: 4,
            aDefined: 1,
            aDefinedNext: 1
        };

        expectVertexShader(
            shaders.vertexShader(),
            attributes,
            uniforms
        ).toHaveGlPosition([-0.0018, 3.9893, 0, 1]);
    });

    it('correctly positions a point in the middle of a series', () => {
        const attributes = {
            aCorner: [-1, +1, 1, 0],
            aCrossNextValue: 2,
            aMainNextValue: 4,
            aCrossValue: 1,
            aMainValue: 5,
            aDefined: 1,
            aDefinedNext: 1
        };

        expectVertexShader(
            shaders.vertexShader(),
            attributes,
            uniforms
        ).toHaveGlPosition([0.9946, 4.9964, 0, 1]);
    });

    it('correctly positions the last point in a series', () => {
        const attributes = {
            aCorner: [-1, +1, 1, 0],
            aCrossNextValue: 8,
            aMainNextValue: 5,
            aCrossValue: 7,
            aMainValue: 4,
            aDefined: 1,
            aDefinedNext: 1
        };

        expectVertexShader(
            shaders.vertexShader(),
            attributes,
            uniforms
        ).toHaveGlPosition([6.9982, 3.9893, 0, 1]);
    });
});
