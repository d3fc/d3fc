import bufferBuilder from '../buffers/bufferBuilder';

export default () => {
    let program = null;
    let vertexShader = null;
    let fragmentShader = null;
    let numElements = null;
    let mode = 4; // gl.TRIANGLES
    let first = 0;
    let buffers = bufferBuilder();

    const build = (gl) => {
        if (newProgram(gl, program, vertexShader(), fragmentShader())) {
            gl.deleteProgram(program);
            program = createProgram(gl, vertexShader(), fragmentShader());
        }
        gl.useProgram(program);

        buffers(gl, program, numElements);

        gl.drawArrays(mode, first, numElements);
    };

    build.apply = (fn, ...args) => {
        fn(build, ...args);
        return build;
    };

    build.buffers = (...args) => {
        if (!args.length) {
            return buffers;
        }
        buffers = args[0];
        return build;
    };

    build.vertexShader = (...args) => {
        if (!args.length) {
            return vertexShader;
        }
        vertexShader = args[0];
        return build;
    };

    build.fragmentShader = (...args) => {
        if (!args.length) {
            return fragmentShader;
        }
        fragmentShader = args[0];
        return build;
    };

    build.numElements = (...args) => {
        if (!args.length) {
            return numElements;
        }
        numElements = args[0];
        return build;
    };

    build.mode = (...args) => {
        if (!args.length) {
            return mode;
        }
        mode = args[0];
        return build;
    };

    build.first = (...args) => {
        if (!args.length) {
            return first;
        }
        first = args[0];
        return build;
    };

    return build;

    /**
     *
     * @param {WebGLRenderingContext} gl
     * @param {WebGLProgram} program
     * @param {string} vertexShader
     * @param {string} fragmentShader
     */
    function newProgram(gl, program, vertexShader, fragmentShader) {
        if (!program) {
            return true;
        }

        const shaders = gl.getAttachedShaders(program);
        const vSource = gl.getShaderSource(shaders[0]);
        const fSource = gl.getShaderSource(shaders[1]);

        return vertexShader !== vSource || fragmentShader !== fSource;
    }

    function createProgram(gl, vertexShader, fragmentShader) {
        const vShader = loadShader(gl, vertexShader, gl.VERTEX_SHADER);
        const fShader = loadShader(gl, fragmentShader, gl.FRAGMENT_SHADER);

        const program = gl.createProgram();
        gl.attachShader(program, vShader);
        gl.attachShader(program, fShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.log(gl.getProgramInfoLog(program));
            gl.deleteProgram(program);
            return null;
        }

        return program;
    }

    function loadShader(gl, source, type) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.log(gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }

        return shader;
    }
};
