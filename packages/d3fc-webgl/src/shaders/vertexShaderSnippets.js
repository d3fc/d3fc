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

export const errorBar = {
    header: `attribute float aXValue;
        attribute float aYValue;
        attribute float aXDirection;
        attribute float aYDirection;
        attribute float aBandwidth;
        uniform vec2 uScreen;
        uniform float uWidth;`,
    body: `gl_Position = vec4(aXValue, aYValue, 0, 1);`
};

export const area = {
    header: `attribute float aXValue;
        attribute float aYValue;
        attribute float aXPrevValue;
        attribute float aYPrevValue;
        attribute float aY0Value;
        attribute float aY0PrevValue;
        attribute vec3 aCorner;
        attribute float aDefined;
        varying float vDefined;
        
        float when_lt(float a, float b) {
            return max(sign(b - a), 0.0);
        }
        
        float when_gt(float a, float b) {
            return max(sign(a - b), 0.0);
        }
        
        float and(float a, float b) {
            return a * b;
        }
        
        float or(float a, float b) {
            return min(a + b, 1.0);
        }`,
    body: `vDefined = aDefined;
        gl_Position = vec4(0, 0, 0, 1);

        float interceptY0PosGrad = and(when_lt(aYPrevValue, aY0PrevValue), when_gt(aYValue, aY0Value));
        float interceptY0NegGrad = and(when_gt(aYPrevValue, aY0PrevValue), when_lt(aYValue, aY0Value));
        float useIntercept = and(aCorner.z, or(interceptY0PosGrad, interceptY0NegGrad));
        
        float yGradient = (aYValue - aYPrevValue) / (aXValue - aXPrevValue);
        float yConstant = aYValue - (yGradient * aXValue);
        
        float y0Gradient = (aY0Value - aY0PrevValue) / (aXValue - aXPrevValue);
        float y0Constant = aY0Value - (y0Gradient * aXValue);
        
        float interceptXValue = (y0Constant - yConstant) / (yGradient - y0Gradient);
        float interceptYValue = (yGradient * interceptXValue) + yConstant;

        gl_Position = vec4(interceptXValue * useIntercept, interceptYValue * useIntercept, 0, 1);
        
        gl_Position.x += ((aCorner.x * aXValue) + ((1.0 - aCorner.x) * aXPrevValue)) * (1.0 - useIntercept);
        gl_Position.y += ((aCorner.x * (1.0 - aCorner.y) * aYValue) + ((1.0 - aCorner.x) * (1.0 - aCorner.y) * aYPrevValue)) * (1.0 - useIntercept);
        gl_Position.y += ((aCorner.x * aCorner.y * aY0Value) + ((1.0 - aCorner.x) * aCorner.y * aY0PrevValue)) * (1.0 - useIntercept);`
};
