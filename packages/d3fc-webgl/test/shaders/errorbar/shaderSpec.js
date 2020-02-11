import * as fc from '../../../index';
import { expectVertexShader, getShaders } from '../../util/vertextShaderUtil';

it('test', () => {
    const shaders = getShaders(fc.webglSeriesErrorBar());

    const attributes = {
        aCrossValue: 0,
        aHighValue: 20,
        aLowValue: 10,
        aBandwidth: 5,
        aCorner: [0, 1, -1]
    };

    const uniforms = {
        uScreen: [2, 2],
        uStrokeWidth: 1
    };

    expectVertexShader(
        shaders.vertexShader(),
        attributes,
        uniforms
    ).toHaveGlPosition([-1, 10, 0, 1]);
});
