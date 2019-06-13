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
        const x = convertScale(xScale, gl.canvas.width, false);
        const y = convertScale(yScale, gl.canvas.height, true);

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

    const convertScale = (scale, screenSize, invert = false) => {
        const range = scale.range();
        const domain = scale.domain();
        const invertConst = invert ? -1 : 1;

        // screen: (0 -> screenSize), scale: (range[0] -> range[1])
        if (isLinear(scale)) {
            const asDate = domain[0] instanceof Date;
            const numDomain = asDate ? domain.map(d => d.valueOf()) : domain;
            const scaleFn = asDate ? d => d.valueOf() :  d => d;

            // Calculate the screen-space domain for the projection
            const domainSize = (numDomain[1] - numDomain[0]) * screenSize / (range[1] - range[0]);

            // numDomain[0] = screenDomainStart + range[0] * domainSize / screenSize;
            const screenDomainStart = numDomain[0] - domainSize * range[0] / screenSize;
            const screenDomain = [screenDomainStart, screenDomainStart + domainSize];

            return {
                pixelSize: Math.abs((screenDomain[1] - screenDomain[0]) / screenSize),
                offset: screenDomain[invert ? 1 : 0],
                scaleFactor: invertConst * (screenDomain[1] - screenDomain[0]),
                scale: scaleFn
            };
        } else {
            const screenRange = range.map(r => 2 * r / screenSize - 1);
            return {
                pixelSize: Math.abs(2 / screenSize),
                offset: invert ? 1 : -1,
                scaleFactor: invertConst * 2,
                scale: scale.copy().range(screenRange)
            };
        }
    };

    gl[PRIVATE] = api;
    return api;
};
