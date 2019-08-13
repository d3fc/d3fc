import bufferBuilder from '../buffers/bufferBuilder';
import drawModes from './drawModes';

export default () => {
    let context = null;
    let program = null;
    let vertexShader = null;
    let fragmentShader = null;
    let numElements = null;
    let mode = drawModes.TRIANGLES;
    let first = 0;
    let buffers = bufferBuilder();

    const build = () => {
        const vtx = vertexShader();
        const frg = fragmentShader();
        if (newProgram(program, vtx, frg)) {
            context.deleteProgram(program);
            program = createProgram(vtx, frg);
        }
        context.useProgram(program);

        buffers(context, program, numElements);

        context.drawArrays(mode, first, numElements);
    };

    build.context = (...args) => {
        if (!args.length) {
            return context;
        }
        context = args[0];
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

    function newProgram(program, vertexShader, fragmentShader) {
        if (!program) {
            return true;
        }

        const shaders = context.getAttachedShaders(program);
        const vSource = context.getShaderSource(shaders[0]);
        const fSource = context.getShaderSource(shaders[1]);

        return vertexShader !== vSource || fragmentShader !== fSource;
    }

    function createProgram(vertexShader, fragmentShader) {
        const vShader = loadShader(vertexShader, context.VERTEX_SHADER);
        const fShader = loadShader(fragmentShader, context.FRAGMENT_SHADER);

        const program = context.createProgram();
        context.attachShader(program, vShader);
        context.attachShader(program, fShader);
        context.linkProgram(program);

        if (!context.getProgramParameter(program, context.LINK_STATUS)) {
            const message = context.getProgramInfoLog(program);
            context.deleteProgram(program);
            throw new Error(`Failed to link program : ${message}
            Vertex Shader : ${vertexShader}
            Fragment Shader : ${fragmentShader}`);
        }

        return program;
    }

    function loadShader(source, type) {
        const shader = context.createShader(type);
        context.shaderSource(shader, source);
        context.compileShader(shader);

        if (!context.getShaderParameter(shader, context.COMPILE_STATUS)) {
            const message = context.getShaderInfoLog(shader);
            context.deleteShader(shader);
            throw new Error(`Failed to compile shader : ${message}
            Shader : ${source}`);
        }

        return shader;
    }
};
