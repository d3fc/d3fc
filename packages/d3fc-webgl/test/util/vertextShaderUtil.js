const Compiler = require('glsl-transpiler');

export const getShaders = element => {
    let _program;
    try {
        const bar = element.decorate(program => {
            _program = program;
            throw new Error('HACKY_SOLUTION');
        });
        bar();
    } catch (e) {
        if (e.message !== 'HACKY_SOLUTION') {
            throw e;
        }
    }

    return {
        vertexShader: _program.vertexShader(),
        fragmentShader: _program.fragmentShader()
    };
};

export const expectVertexShader = (shader, attributes, uniforms) => {
    return {
        toHaveGlPosition: glPosition =>
            expect(executeVertexShader(shader, attributes, uniforms)).toEqual({
                gl_Position: glPosition
            })
    };
};

export const transpileGlsl = shader => {
    const compile = Compiler({
        uniform: function(name) {
            return `uniforms.${name}`;
        },
        attribute: function(name) {
            return `attributes.${name}`;
        }
    });

    return compile(shader);
};

const executeVertexShader = (shader, attributes, uniforms) => {
    // eslint-disable-next-line no-new-func
    const jsFunction = new Function(
        'attributes',
        'uniforms',
        `var gl_Position = [0,0,0,0];
        ${transpileGlsl(shader)}

        debugger;
        main();
        return { gl_Position };`
    );

    return jsFunction(attributes, uniforms);
};
