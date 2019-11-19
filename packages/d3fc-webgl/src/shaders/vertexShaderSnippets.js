export const scale = {
    header: `uniform vec2 uScale;`,
    body: `gl_Position.xy = gl_Position.xy * uScale;`
};

export const translate = {
    header: `uniform vec2 uTranslate;`,
    body: `gl_Position.xy = gl_Position.xy + uTranslate;`
};

export const multiColor = {
    header: `uniform vec4 uColor;
             varying vec4 vColor;`,
    body: `vColor = uColor;`
};

export const circle = {
    header: `attribute float aXValue;
             attribute float aYValue;
             attribute float aSize;
             uniform float uStrokeWidth;
             varying float vSize;`,
    body: `vSize = 2.0 * sqrt(aSize / 3.14159);
           gl_PointSize = vSize + uStrokeWidth + 1.0;
           gl_Position = vec4(aXValue, aYValue, 0, 1);`
};

export const square = {
    header: `attribute float aXValue;
        attribute float aYValue;
        attribute float aSize;
        uniform float uStrokeWidth;
        varying float vSize;`,
    body: `vSize = sqrt(aSize);
        gl_PointSize = vSize + uStrokeWidth + 1.0;
        gl_Position = vec4(aXValue, aYValue, 0, 1);`
};

export const triangle = {
    header: `attribute float aXValue;
        attribute float aYValue;
        attribute float aSize;
        uniform float uStrokeWidth;
        varying float vSize;`,
    body: `vSize = sqrt((16.0 * aSize) / (3.0 * sqrt(3.0)));
        gl_PointSize = vSize + uStrokeWidth + 1.0;
        gl_Position = vec4(aXValue, aYValue, 0, 1);`
};

export const ohlc = {
    header: `attribute float aXValue;
        attribute float aYValue;
        attribute float aXDirection;
        attribute float aYDirection;
        attribute float aBandwidth;
        attribute float aColorIndicator;
        varying float vColorIndicator;
        uniform vec2 uScreen;
        uniform float uWidth;`,
    body: `vColorIndicator = aColorIndicator;
    gl_Position = vec4(aXValue, aYValue, 0, 1);`
};

export const area = {
    header: `attribute float aXValue;
        attribute float aYValue;
        attribute float aXPrevValue;
        attribute float aYPrevValue;
        attribute vec2 aCorner;
        attribute float aDefined;
        varying float vDefined;
        uniform float uY0Value;
        attribute vec4 aColor;
        varying vec4 vColor;`,
    body: `vDefined = aDefined;
        gl_Position = vec4(0, 0, 0, 1);
        gl_Position.x += (aCorner.x * aXValue) + ((1.0 - aCorner.x) * aXPrevValue);
        gl_Position.y += (aCorner.x * (1.0 - aCorner.y) * aYValue) + ((1.0 - aCorner.x) * (1.0 - aCorner.y) * aYPrevValue) + (aCorner.y * uY0Value);
        vColor = aColor;`
};
