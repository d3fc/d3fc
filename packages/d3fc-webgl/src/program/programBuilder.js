import bufferBuilder from '../buffers/bufferBuilder';
import uniformBuilder from '../buffers/uniformBuilder';
import drawModes from './drawModes';

export default () => {
    let context = null;
    let program = null;
    let vertexShader = null;
    let fragmentShader = null;
    let mode = drawModes.TRIANGLES;
    let buffers = bufferBuilder();
    let verticesPerElement = 1;

    const build = count => {
        const vertexShaderSource = vertexShader();
        const fragmentShaderSource = fragmentShader();
        if (newProgram(program, vertexShaderSource, fragmentShaderSource)) {
            context.isProgram(program) && context.deleteProgram(program);
            program = createProgram(vertexShaderSource, fragmentShaderSource);
        }
        context.useProgram(program);

        buffers.uniform(
            'uScreen',
            uniformBuilder([context.canvas.width, context.canvas.height])
        );
        buffers(context, program, verticesPerElement, count);

        context.drawArrays(mode, 0, count * verticesPerElement);
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

    build.mode = (...args) => {
        if (!args.length) {
            return mode;
        }
        mode = args[0];
        return build;
    };

    build.verticesPerElement = (...args) => {
        if (!args.length) {
            return verticesPerElement;
        }
        verticesPerElement = args[0];
        return build;
    };

    return build;

    function newProgram(program, vertexShader, fragmentShader) {
        if (!program) {
            return true;
        }

        const shaders = context.getAttachedShaders(program);
        const vertexShaderSource = context.getShaderSource(shaders[0]);
        const fragmentShaderSource = context.getShaderSource(shaders[1]);

        return (
            vertexShader !== vertexShaderSource ||
            fragmentShader !== fragmentShaderSource
        );
    }

    function createProgram(vertexShaderSource, fragmentShaderSource) {
        const vertexShader = loadShader(
            vertexShaderSource,
            context.VERTEX_SHADER
        );
        const fragmentShader = loadShader(
            fragmentShaderSource,
            context.FRAGMENT_SHADER
        );

        const program = context.createProgram();
        context.attachShader(program, vertexShader);
        context.attachShader(program, fragmentShader);
        context.linkProgram(program);

        if (!context.getProgramParameter(program, context.LINK_STATUS)) {
            const message = context.getProgramInfoLog(program);
            context.deleteProgram(program);
            throw new Error(`Failed to link program : ${message}
            Vertex Shader : ${vertexShaderSource}
            Fragment Shader : ${fragmentShaderSource}`);
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
