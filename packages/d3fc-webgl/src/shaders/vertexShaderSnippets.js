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

export const rect = {
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
        
        float and(float a, float b) {
            return a * b;
        }`,
    body: `vDefined = aDefined;
        gl_Position = vec4(0, 0, 0, 1);

        float hasIntercepted = when_lt((aYValue - aY0Value) * (aYPrevValue - aY0PrevValue), 0.0);
        float useIntercept = and(aCorner.z, hasIntercepted);
        
        float yGradient = (aYValue - aYPrevValue) / (aXValue - aXPrevValue);
        float yConstant = aYValue - (yGradient * aXValue);

        float y0Gradient = (aY0Value - aY0PrevValue) / (aXValue - aXPrevValue);
        float y0Constant = aY0Value - (y0Gradient * aXValue);

        float denominator = (yGradient - y0Gradient) + step(abs(yGradient - y0Gradient), 0.0);
        float interceptXValue = (y0Constant - yConstant) / denominator;
        float interceptYValue = (yGradient * interceptXValue) + yConstant;

        gl_Position = vec4(interceptXValue * useIntercept, interceptYValue * useIntercept, 0, 1);
        
        gl_Position.x += (1.0 - useIntercept) * ((aCorner.x * aXValue) + ((1.0 - aCorner.x) * aXPrevValue));
        gl_Position.y += (1.0 - useIntercept) * (1.0 - aCorner.y) * ((aCorner.x * aYValue) + ((1.0 - aCorner.x) * aYPrevValue));
        gl_Position.y += (1.0 - useIntercept) * aCorner.y * ((aCorner.x * aY0Value) + ((1.0 - aCorner.x) * aY0PrevValue));`
};

export const boxPlot = {
    header: `attribute float aXValue;
        attribute float aYValue;
        attribute float aXDirection;
        attribute float aYDirection;
        attribute float aBandwidth;
        uniform vec2 uScreen;
        uniform float uWidth;`,
    body: `gl_Position = vec4(aXValue, aYValue, 0, 1);`
}
