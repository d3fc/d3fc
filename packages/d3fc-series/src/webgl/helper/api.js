import triangles from '../shaders/triangles';
import circles from '../shaders/circles';
import pointTextures from '../shaders/pointTextures';

const drawFunctions = {
    triangles,
    circles,
    pointTextures
};

export const PRIVATE = '__d3fcAPI';

export default (gl) => {
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    if (gl[PRIVATE]) return gl[PRIVATE];

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const drawModules = {};
    let modelView = null;

    // Helper API functions
    const api = {};

    let activated;
    Object.keys(drawFunctions).forEach(key => {
        api[key] = (...args) => {
            if (!drawModules[key]) {
                // Lazy-load the shaders when used
                drawModules[key] = drawFunctions[key](gl);
            }

            // Activate the shader if not already activate
            if (activated !== key) drawModules[key].activate();
            activated = key;

            drawModules[key].setModelView(modelView);
            return drawModules[key](...args);
        };
    });

    api.applyScales = (xScale, yScale) => {
        const x = convertScale(xScale);
        const y = convertScale(yScale);

        modelView = {
            offset: [x.offset, y.offset],
            scale: [x.scaleFactor, y.scaleFactor]
        };

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
            const asDate = domain[0] instanceof Date;
            const numDomain = asDate ? domain.map(d => d.valueOf()) : domain;
            const scaleFn = asDate ? d => d.valueOf() :  d => d;

            return {
                pixelSize: Math.abs((numDomain[1] - numDomain[0]) / (range[1] - range[0])),
                offset: numDomain[0],
                scaleFactor: numDomain[1] - numDomain[0],
                scale: scaleFn
            };
        } else {
            return {
                pixelSize: Math.abs(2 / (range[1] - range[0])),
                offset: -1,
                scaleFactor: 2,
                scale: scale.copy().range([-1, 1])
            };
        }
    };

    gl[PRIVATE] = api;
    return api;
};
