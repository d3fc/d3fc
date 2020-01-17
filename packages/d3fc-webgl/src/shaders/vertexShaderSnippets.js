export const scale = {
    header: `uniform vec2 uScale;`,
    body: `gl_Position.xy = gl_Position.xy * uScale;`
};

export const translate = {
    header: `uniform vec2 uTranslate;`,
    body: `gl_Position.xy = gl_Position.xy + uTranslate;`
};

export const multiColor = {
    header: `attribute vec4 aColor;
             varying vec4 vColor;`,
    body: `vColor = aColor;`
};

export const circle = {
    header: `attribute float aXValue;
             attribute float aYValue;
             attribute float aSize;
             uniform float uLineWidth;
             varying float vSize;`,
    body: `vSize = 2.0 * sqrt(aSize / 3.14159);
           gl_PointSize = vSize + uLineWidth + 1.0;
           gl_Position = vec4(aXValue, aYValue, 0, 1);`
};

export const square = {
    header: `attribute float aXValue;
        attribute float aYValue;
        attribute float aSize;
        uniform float uLineWidth;
        varying float vSize;`,
    body: `vSize = sqrt(aSize);
        gl_PointSize = vSize + uLineWidth + 1.0;
        gl_Position = vec4(aXValue, aYValue, 0, 1);`
};

export const triangle = {
    header: `attribute float aXValue;
        attribute float aYValue;
        attribute float aSize;
        uniform float uLineWidth;
        varying float vSize;`,
    body: `vSize = sqrt((16.0 * aSize) / (3.0 * sqrt(3.0)));
        gl_PointSize = vSize + uLineWidth + 1.0;
        gl_Position = vec4(aXValue, aYValue, 0, 1);`
};

export const cross = {
    header: `attribute float aXValue;
        attribute float aYValue;
        attribute float aSize;
        uniform float uStrokeWidth;
        varying float vSize;
        varying float vStrokeWidthRatio;`,
    body: `vSize = 3.0 * sqrt(aSize / 5.0);
        vStrokeWidthRatio = uStrokeWidth / (vSize + uStrokeWidth + 1.0);
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
        uniform float uLineWidth;`,
    body: `vColorIndicator = aColorIndicator;
    gl_Position = vec4(aXValue, aYValue, 0, 1);`
};

export const bar = {
    header: `attribute float aXValue;
        attribute float aYValue;
        attribute float aWidthValue;
        attribute float aDirection;`,
    body: `gl_Position = vec4(aXValue, aYValue, 0, 1);
        vec4 origin = vec4(0.0, 0.0, 0.0, 0.0);
        vec4 width = vec4(aWidthValue, 0.0, 0.0, 0.0);
        gl_Position.x += (width.x - origin.x) / 2.0 * aDirection;`
};

export const preScaleLine = {
    header: `uniform float uLineWidth; // defines the width of the line
        uniform vec2 uScreen; // the screen space canvas size (for normalizing vectors)
        attribute vec2 aCorner; // defines which vertex in the line join we are considering
        attribute float aXValue; attribute float aYValue; // the current vertex positions
        attribute float aNextXValue; attribute float aNextYValue; // the next vertex positions
        attribute float aPrevXValue; attribute float aPrevYValue; // the previous vertex positions
        attribute float aDefined;
        varying float vDefined;`,
    body: `vDefined = aDefined;
        vec4 curr = vec4(aXValue, aYValue, 0, 1);
        gl_Position = curr;
        vec4 next = vec4(aNextXValue, aNextYValue, 0, 0);
        vec4 prev = vec4(aPrevXValue, aPrevYValue, 0, 0);`
};

export const postScaleLine = {
    body: `if (all(equal(gl_Position.xy, prev.xy))) {
            prev.xy = gl_Position.xy + normalize(gl_Position.xy - next.xy);
        }
        if (all(equal(gl_Position.xy, next.xy))) {
            next.xy = gl_Position.xy + normalize(gl_Position.xy - prev.xy);
        }
        vec2 A = normalize(normalize(gl_Position.xy - prev.xy) * uScreen);
        vec2 B = normalize(normalize(next.xy - gl_Position.xy) * uScreen);
        vec2 tangent = normalize(A + B);
        vec2 miter = vec2(-tangent.y, tangent.x);
        vec2 normalA = vec2(-A.y, A.x);
        float miterLength = 1.0 / dot(miter, normalA);
        vec2 point = normalize(A - B);
        if (miterLength > 10.0 && sign(aCorner.x * dot(miter, point)) > 0.0) {
            gl_Position.xy = gl_Position.xy - (aCorner.x * aCorner.y * uLineWidth * normalA) / uScreen.xy;
        } else {
            gl_Position.xy = gl_Position.xy + (aCorner.x * miter * uLineWidth * miterLength) / uScreen.xy;
        }`
};

export const errorBar = {
    header: `attribute float aXValue;
        attribute float aHighValue;
        attribute float aLowValue;
        attribute float aBandwidth;
        attribute vec3 aCorner;
        uniform vec2 uScreen;
        uniform float uLineWidth;`,
    body: `
        float isLow = (aCorner.y + 1.0) / 2.0;
        float yValue = isLow * aLowValue + (1.0 - isLow) * aHighValue;

        float isEdgeCorner = abs(aCorner.x);
        float lineWidthXDirection = (1.0 - isEdgeCorner) * aCorner.z;
        float lineWidthYDirection = isEdgeCorner * aCorner.z;
        
        gl_Position = vec4(aXValue, yValue, 0, 1);
        
        float xModifier = ((uLineWidth * lineWidthXDirection) + (aBandwidth * aCorner.x));
        float yModifier = (uLineWidth * lineWidthYDirection);
    `
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
        uniform float uLineWidth;`,
    body: `gl_Position = vec4(aXValue, aYValue, 0, 1);`
};
