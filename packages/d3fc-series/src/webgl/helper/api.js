import setup from './setup';
import modelScale from './modelScale';

import triangles from '../shaders/triangles';
import edges from '../shaders/edges';

const drawFunctions = {
    triangles,
    edges
};

export const PRIVATE = '__d3fcAPI';

export default (gl) => {
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    if (gl[PRIVATE]) return gl[PRIVATE];

    const drawModules = {};
    const { projectionMatrix } = setup(gl);
    let modelViewMatrix = null;

    // Helper API functions
    const api = {};

    let activated;
    Object.keys(drawFunctions).forEach(key => {
        api[key] = (...args) => {
            if (!drawModules[key]) {
                // Lazy-load the shaders when used
                drawModules[key] = drawFunctions[key](gl, projectionMatrix);
            }

            // Activate the shader if not already activate
            if (activated !== key) drawModules[key].activate();
            activated = key;

            drawModules[key].setModelView(modelViewMatrix);
            return drawModules[key](...args);
        };
    });

    api.applyScales = (xScale, yScale) => {
        const x = convertScale(xScale);
        const y = convertScale(yScale);

        modelViewMatrix = modelScale([x.modelScale, y.modelScale]);
        return {
            pixel: {
                x: x.pixelSize,
                y: y.pixelSize
            },
            xScale: x.scale,
            yScale: y.scale
        };
    };

    const isLinear = scale => {
        if (scale.domain && scale.range && scale.clamp && !scale.exponent && !scale.base) {
            return !scale.clamp();
        }
        return false;
    };

    const convertScale = scale => {
        const range = scale.range();
        const domain = scale.domain();

        if (isLinear(scale)) {
            return {
                pixelSize: Math.abs((domain[1] - domain[0]) / (range[1] - range[0])),
                modelScale: scale,
                scale: d => d
            };
        } else {
            return {
                pixelSize: Math.abs(2 / (range[1] - range[0])),
                modelScale: null,
                scale: scale.copy().range([-1, 1])
            };
        }
    };

    gl[PRIVATE] = api;
    return api;
};
