import * as fc from '../index';

describe('shaderBuilder', () => {
    let shaderBuilder;

    beforeEach(
        () =>
            (shaderBuilder = fc.webglShaderBuilder(
                (header, body) => `${header} ${body}`
            ))
    );

    it('should build the shaders with snippets', () => {
        shaderBuilder.appendHeader('some shader code');
        shaderBuilder.appendHeader('some more shader code');
        shaderBuilder.insertHeader(
            'this should be in the middle',
            'some more shader code'
        );
        expect(shaderBuilder()).toContain(
            'some shader code\nthis should be in the middle\nsome more shader code'
        );
    });
});
