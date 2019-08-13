import * as fragmentShaderSnippets from '../../fragmentShaderSnippets';

export default() => {
    const antialias = (program) => {
        program.fragmentShader()
            .appendBodyIfNotExists(fragmentShaderSnippets.circleAlias.body);
    };

    return antialias;
};
