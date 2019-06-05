import setup from './setup';

import triangles from '../shaders/triangles';
import edges from '../shaders/edges';

const drawFunctions = {
    triangles,
    edges
};

export default (gl) => {
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    if (gl.api) return gl.api;

    const drawModules = {};
    const { projectionMatrix, modelViewMatrix } = setup(gl);

    // Helper API functions
    const api = {};

    let activated;
    Object.keys(drawFunctions).forEach(key => {
        api[key] = (...args) => {
            if (!drawModules[key]) {
                // Lazy-load the shaders when used
                drawModules[key] = drawFunctions[key](gl, projectionMatrix, modelViewMatrix);
            }

            // Activate the shader if not already activate
            if (activated !== key) drawModules[key].activate();
            activated = key;

            return drawModules[key](...args);
        };
    });

    gl.api = api;
    return api;
};
