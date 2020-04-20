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

// See https://iquilezles.org/www/articles/distfunctions2d/distfunctions2d.htm.
export const star = {
    header: `
        varying float vSize;
        varying float vDefined;

        // anterior, exterior angles
        float an = 0.628319;
        vec2 acs = vec2(0.809017, 0.587786); // (cos, sin)
        float en = 0.952000;
        vec2 ecs = vec2(0.580055, 0.814577);
    `,
    body: `
        float canFill = 1.0;

        vec2 p = 2.0 * gl_PointCoord - 1.0;
        p.y *= -1.0;

        // sector
        float bn = mod(atan(p.x, p.y), 2.0 * an) - an;
        p = length(p) * vec2(cos(bn), abs(sin(bn)));

        p -= acs;
        p += ecs * clamp(-dot(p, ecs), 0.0, acs.y / ecs.y);
        float d = length(p) * sign(p.x);

        float distance = 1.0 + d;
        float canStroke = smoothstep(vSize - 2.0, vSize, distance * vSize);
        if (distance > 1.0 || vDefined < 0.5) {
            discard;
            return;
        }`
};

export const wye = {
    header: `
        varying float vSize;
        varying float vDefined;
    `,
    body: `
        float canFill = 1.0;

        vec2 p = 2.0 * gl_PointCoord - 1.0;
        p.y *= -1.0;

        // sector
        float an = 3.141593 / 3.0;
        float bn = mod(atan(p.x, p.y), 2.0 * an) - an;
        p = length(p) * vec2(cos(bn), abs(sin(bn)));

        // box
        vec2 d = abs(p) - vec2(0.9, 0.35);
        float sdf = length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);

        float distance = 1.0 + sdf;
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

// Diamond is symmetrical about the x, and y axes, so only consider x, y > 0.
// (x, y) are the coordinates of the fragment within the gl point (after
// transformed to be [-1, 1]).
// a, b control the width, height of the triangle, so diamond is 2a, 2b.
// Line L is a ray from the origin through (x, y), the distance function is then
// the distance to (x, y) divided by the distance to where L intersects with the
// diamond, this makes the distance function < 1 inside, 1 on the boundary, and
// > 1 outside the diamond.
//    |
// b ---
//    |\             L
//    | -\          /
//    |   \        /
//    |    \      /
//    |     -\   /
//    |       \ /
// Y ---       X
//    |       / -\
//    |      /    \
//    |     /      \
// y ---   X        -\
//    |   /           \
//    |  /             \
//    | /               -\
//    |/                  \
//    +----|---|-----------|---
//         x   X           a
export const diamond = {
    header: `
        varying float vSize;
        varying float vDefined;
        float a = 0.6;
        float b = 1.0;
    `,
    body: `
        if (vDefined < 0.5) {
            discard;
        }

        vec2 pointCoordTransform = 2.0 * gl_PointCoord - 1.0;

        float x = abs(pointCoordTransform.x);
        float y = abs(pointCoordTransform.y);

        float X = (a * b * x) / (a * y + b * x);
        float Y = (a * b * y) / (a * y + b * x);

        float distance = length(vec2(x, y)) / length(vec2(X, Y));

        if (distance > 1.0) {
            discard;
        }
    `
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
    `,
    body: `
        float canFill = 0.0;
        float canStroke = 1.0;

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
