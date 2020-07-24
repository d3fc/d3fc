import bufferBuilder from '../buffer/bufferBuilder';
import uniform from '../buffer/uniform';
import drawModes from './drawModes';

export default () => {
    let context = null;
    let program = null;
    let vertexShader = null;
    let fragmentShader = null;
    let programVertexShader = null;
    let programFragmentShader = null;
    let mode = drawModes.TRIANGLES;
    let subInstanceCount = 0;
    let buffers = bufferBuilder();
    let debug = false;
    let extInstancedArrays = null;
    let dirty = true;
    let pixelRatio = 1;

    const build = count => {
        if (context == null) {
            return;
        }

        const vertexShaderSource = vertexShader();
        const fragmentShaderSource = fragmentShader();
        if (newProgram(program, vertexShaderSource, fragmentShaderSource)) {
            program = createProgram(vertexShaderSource, fragmentShaderSource);
            programVertexShader = vertexShaderSource;
            programFragmentShader = fragmentShaderSource;
            dirty = false;
        }
        context.useProgram(program);

        buffers.uniform(
            'uScreen',
            uniform([
                context.canvas.width / pixelRatio,
                context.canvas.height / pixelRatio
            ])
        );

        buffers(build, program);

        if (subInstanceCount === 0) {
            if (buffers.elementIndices() == null) {
                context.drawArrays(mode, 0, count);
            } else {
                context.drawElements(mode, count, context.UNSIGNED_SHORT, 0);
            }
        } else {
            if (buffers.elementIndices() == null) {
                extInstancedArrays.drawArraysInstancedANGLE(
                    mode,
                    0,
                    subInstanceCount,
                    count
                );
            } else {
                const elementIndicesLength = buffers.elementIndices().data()
                    .length;
                if (subInstanceCount !== elementIndicesLength) {
                    throw new Error(
                        `Expected elementIndices length ${elementIndicesLength}` +
                            ` to match subInstanceCount ${subInstanceCount}.`
                    );
                }
                extInstancedArrays.drawElementsInstancedANGLE(
                    mode,
                    subInstanceCount,
                    context.UNSIGNED_SHORT,
                    0,
                    count
                );
            }
        }
    };

    build.extInstancedArrays = () => extInstancedArrays;

    build.context = (...args) => {
        if (!args.length) {
            return context;
        }
        if (args[0] == null || args[0] !== context) {
            buffers.flush();
            dirty = true;
        }
        if (args[0] != null && args[0] !== context) {
            extInstancedArrays = args[0].getExtension('ANGLE_instanced_arrays');
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

    build.subInstanceCount = (...args) => {
        if (!args.length) {
            return subInstanceCount;
        }
        subInstanceCount = args[0];
        return build;
    };

    build.debug = (...args) => {
        if (!args.length) {
            return debug;
        }
        debug = args[0];
        return build;
    };

    build.pixelRatio = (...args) => {
        if (!args.length) {
            return pixelRatio;
        }
        pixelRatio = args[0];
        return build;
    };

    return build;

    function newProgram(program, vertexShader, fragmentShader) {
        if (!program || dirty) {
            return true;
        }

        return (
            vertexShader !== programVertexShader ||
            fragmentShader !== programFragmentShader
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

        if (
            debug &&
            !context.getProgramParameter(program, context.LINK_STATUS)
        ) {
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

        if (
            debug &&
            !context.getShaderParameter(shader, context.COMPILE_STATUS)
        ) {
            const message = context.getShaderInfoLog(shader);
            context.deleteShader(shader);
            throw new Error(`Failed to compile shader : ${message}
            Shader : ${source}`);
        }

        return shader;
    }
};
