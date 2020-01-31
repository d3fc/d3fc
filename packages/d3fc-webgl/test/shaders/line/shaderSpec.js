import * as fc from '../../../index';
import { expectVertexShader, getShaders } from '../../util/vertextShaderUtil';

describe('glLine', () => {
    const line = fc
        .glLine()
        .xScale(fc.glScaleLinear())
        .yScale(fc.glScaleLinear());

    const shaders = getShaders(line);

    const uniforms = {
        uScreen: [500, 250],
        uLineWidth: 2,
        linear0Offset: [0, 0, 0, 0],
        linear0Scale: [1, 1, 1, 1],
        linear1Offset: [0, 0, 0, 0],
        linear1Scale: [1, 1, 1, 1]
    };

    it('correctly positions the first point in a series', () => {
        const attributes = {
            aCorner: [-1, 0, 0],
            aXValue: 1,
            aYValue: 5,
            aNextXValue: 2,
            aNextYValue: 4,
            aPrevXValue: 0,
            aPrevYValue: 4,
            aPrevPrevXValue: 0,
            aPrevPrevYValue: 4,
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
            aXValue: 2,
            aYValue: 4,
            aNextXValue: 3,
            aNextYValue: 5,
            aPrevXValue: 1,
            aPrevYValue: 5,
            aPrevPrevXValue: 0,
            aPrevPrevYValue: 4,
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
            aXValue: 8,
            aYValue: 5,
            aNextXValue: 8,
            aNextYValue: 5,
            aPrevXValue: 7,
            aPrevYValue: 4,
            aPrevPrevXValue: 6,
            aPrevPrevYValue: 5,
            aDefined: 1
        };

        expectVertexShader(
            shaders.vertexShader(),
            attributes,
            uniforms
        ).toHaveGlPosition([7, 3.9911, 0, 1]);
    });
});
