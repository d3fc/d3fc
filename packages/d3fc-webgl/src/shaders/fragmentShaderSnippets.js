export const circle = {
    header: `
        varying float vSize;
        varying float vDefined;`,
    body: `
        float canFill = 1.0;
        float distance = length(2.0 * gl_PointCoord - 1.0);
        float canStroke = smoothstep(vSize - 2.0, vSize, distance * vSize);
        if (distance > 1.0 || vDefined < 0.5) {
            discard;
            return;
        }`
};

export const square = {
    header: `
        varying float vSize;
        varying float vDefined;`,
    body: `
        float canFill = 1.0;
        if (vDefined < 0.5) {
            discard;
        }
        vec2 pointCoordTransform = 2.0 * gl_PointCoord - 1.0;
        float distance = max(abs(pointCoordTransform.x), abs(pointCoordTransform.y));
        float canStroke = smoothstep(vSize - 2.0, vSize, distance * vSize);`
};

export const triangle = {
    header: `
        varying float vSize;
        varying float vDefined;`,
    body: `
        float canFill = 1.0;
        vec2 pointCoordTransform = 2.0 * gl_PointCoord - 1.0;
        float topEdgesDistance = abs(pointCoordTransform.x) - ((pointCoordTransform.y - 0.6) / sqrt(3.0));
        float bottomEdgeDistance = pointCoordTransform.y + 0.5;
        float distance = max(topEdgesDistance, bottomEdgeDistance);
        float canStroke = smoothstep(vSize - 2.0, vSize, distance * vSize);
        if (distance > 1.0 || vDefined < 0.5) {
            discard;
        }`
};

export const cross = {
    header: `
        varying float vSize;
        varying float vStrokeWidthRatio;
        varying float vDefined;`,
    body: `
        float canFill = 1.0;
        vec2 pointCoordTransform = 2.0 * gl_PointCoord - 1.0;
        float innerCornerDistance = min(abs(pointCoordTransform.x), abs(pointCoordTransform.y)) + 0.66 - vStrokeWidthRatio;
        float outerEdgeDistance = max(abs(pointCoordTransform.x), abs(pointCoordTransform.y));
        float distance = max(innerCornerDistance, outerEdgeDistance);
        float canStroke = smoothstep(vSize - 2.0, vSize, distance * vSize);
        if (distance > 1.0 || vDefined < 0.5) {
            discard;
        }`
};

export const candlestick = {
    header: `
        varying float vColorIndicator;
        varying float vDefined;`,
    body: `
        float canFill = 1.0;
        float canStroke = 0.0;
        if (vDefined < 0.5) {
            discard;
        }
        gl_FragColor = vec4(0.4, 0.8, 0, 1);
        if (vColorIndicator < 0.0) {
            gl_FragColor = vec4(0.8, 0.4, 0, 1);
        }`
};

export const ohlc = {
    header: `
        varying float vColorIndicator;
        varying float vDefined;`,
    body: `
        float canFill = 0.0;
        float canStroke = 1.0;
        if (vDefined < 0.5) {
            discard;
        }
        gl_FragColor = vec4(0.4, 0.8, 0, 1);
        if (vColorIndicator < 0.0) {
            gl_FragColor = vec4(0.8, 0.4, 0, 1);
        }`
};

export const area = {
    header: `
        varying float vDefined;`,
    body: `
        float canFill = 1.0;
        float canStroke = 0.0;
        if (vDefined < 0.5) {
            discard;
        }
        gl_FragColor = vec4(0.86, 0.86, 0.86, 1);`
};

export const boxPlot = {
    header: `
        varying float vDefined;
        varying float vCanFill;
    `,
    body: `
        float canFill = clamp(vCanFill, 0.0, 1.0);
        float canStroke = 1.0 - vCanFill;

        vec4 defaultFillColor = vec4(0.86, 0.86, 0.86, 1.0);
        gl_FragColor = (canFill * defaultFillColor) + (canStroke * gl_FragColor);

        if (vDefined < 0.5) {
            discard;
        }`
};

export const errorBar = {
    header: `varying float vDefined;`,
    body: `
        float canFill = 0.0;
        float canStroke = 1.0;
        if (vDefined < 0.5) {
            discard;
        }`
};

export const bar = {
    header: `varying float vDefined;`,
    body: `
        float canFill = 1.0;
        float canStroke = 0.0;

        gl_FragColor = vec4(0.60, 0.60, 0.60, 1.0);

        if (vDefined < 0.5) {
            discard;
        }`
};

export const pointAlias = {
    body: `gl_FragColor.a = gl_FragColor.a * (1.0 - smoothstep(vSize - 2.0, vSize, distance * vSize));`
};

export const multiColor = {
    header: `varying vec4 vColor;`,
    body: `gl_FragColor = vColor;`
};

export const seriesColor = {
    header: `uniform vec4 uColor;`,
    body: `gl_FragColor = uColor;`
};

export const fillColor = {
    header: `varying vec4 vFillColor;`,
    body: `gl_FragColor = (canFill * vFillColor) + ((1.0 - canFill) * gl_FragColor);`
};

export const strokeColor = {
    header: `varying vec4 vStrokeColor;`,
    body: `gl_FragColor = (canStroke * vStrokeColor) + ((1.0 - canStroke) * gl_FragColor);`
};

export const line = {
    header: `varying float vDefined;`,
    body: `
        float canFill = 0.0;
        float canStroke = 1.0;
        if (vDefined < 0.5) {
            discard;
        }`
};
