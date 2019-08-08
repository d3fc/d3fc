export default (base) => {
    const shaderHeaders = [];
    const shaderBodies = [];

    const build = () => {
        return base(shaderHeaders.join('\n'), shaderBodies.join('\n'));
    };

    build.appendHeader = (header) => {
        shaderHeaders.push(header);
        return build;
    };

    build.insertHeader = (header, before) => {
        let bi = shaderHeaders.indexOf(before);
        shaderHeaders.splice(bi >= 0 ? bi : shaderHeaders.length, 0, header);
        return build;
    };

    build.appendBody = (header) => {
        shaderBodies.push(header);
        return build;
    };

    build.insertBody = (header, before) => {
        let bi = shaderBodies.indexOf(before);
        shaderBodies.splice(bi >= 0 ? bi : shaderBodies.length, 0, header);
        return build;
    };

    return build;
};

// inf is precalculated here for use in some functions (e.g. log scale calculations)
export const vertexShaderBase = (header, body) => `
precision mediump float;
float inf = 1.0 / 0.0;
attribute vec4 aVertexPosition;
${header}
void main() {
    ${body}
}`;

export const fragmentShaderBase = (header, body) => `
precision mediump float;
${header}
void main() {
    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    ${body}
}`;
