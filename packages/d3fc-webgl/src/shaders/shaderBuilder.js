export default base => {
    const shaderHeaders = [];
    const shaderBodies = [];

    const build = () => {
        return base(shaderHeaders.join('\n'), shaderBodies.join('\n'));
    };

    function append(array, element) {
        array.push(element);
    }

    function insert(array, element, before) {
        const beforeIndex = array.indexOf(before);
        array.splice(beforeIndex >= 0 ? beforeIndex : array.length, 0, element);
    }

    function appendIfNotExists(array, element) {
        const elementIndex = array.indexOf(element);
        if (elementIndex === -1) {
            array.push(element);
        }
    }

    build.appendHeader = header => {
        append(shaderHeaders, header);
        return build;
    };

    build.insertHeader = (header, before) => {
        insert(shaderHeaders, header, before);
        return build;
    };

    build.appendHeaderIfNotExists = header => {
        appendIfNotExists(shaderHeaders, header);
        return build;
    };

    build.appendBody = body => {
        append(shaderBodies, body);
        return build;
    };

    build.insertBody = (body, before) => {
        insert(shaderBodies, body, before);
        return build;
    };

    build.appendBodyIfNotExists = body => {
        appendIfNotExists(shaderBodies, body);
        return build;
    };

    return build;
};

// inf is precalculated here for use in some functions (e.g. log scale calculations)
export const vertexShaderBase = (header, body) => `
precision mediump float;
float inf = 1.0 / 0.0;
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
