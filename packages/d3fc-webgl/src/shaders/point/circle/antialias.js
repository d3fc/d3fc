import * as fragmentShaderSnippets from '../../fragmentShaderSnippets';

export default() => {
    const antialias = (program) => {
        program.fragmentShader()
            .appendBody(fragmentShaderSnippets.circleAlias.body);
    };

    return antialias;
};
