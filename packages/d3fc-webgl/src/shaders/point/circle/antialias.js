import * as fragmentShaderSnippets from '../../fragmentShaderSnippets';

export default() => {
    const antiAlias = (program) => {
        program.fragmentShader()
            .appendBodyIfNotExists(fragmentShaderSnippets.circleAlias.body);
    };

    return antiAlias;
};
