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

export const fillColor = {
    header: `attribute vec4 aFillColor;
             varying vec4 vFillColor;`,
    body: `vFillColor = aFillColor;`
};

export const strokeColor = {
    header: `attribute vec4 aStrokeColor;
             varying vec4 vStrokeColor;`,
    body: `vStrokeColor = aStrokeColor;`
};

export const circle = {
    header: `
        attribute float aCrossValue;
        attribute float aMainValue;
        attribute float aSize;
        attribute float aDefined;

        uniform float uStrokeWidth;

        varying float vSize;
        varying float vDefined;`,
    body: `
        vDefined = aDefined;
        vSize = 2.0 * sqrt(aSize / 3.14159);
        gl_PointSize = vSize + uStrokeWidth + 1.0;
        gl_Position = vec4(aCrossValue, aMainValue, 0, 1);`
};

export const star = {
    header: `
        attribute float aCrossValue;
        attribute float aMainValue;
        attribute float aSize;
        attribute float aDefined;

        uniform float uStrokeWidth;

        varying float vSize;
        varying float vDefined;`,
    body: `
        vDefined = aDefined;
        vSize = 4.0 * sqrt(aSize / 3.14159);
        gl_PointSize = vSize + uStrokeWidth + 1.0;
        gl_Position = vec4(aCrossValue, aMainValue, 0, 1);`
};

export const wye = {
    header: `
        attribute float aCrossValue;
        attribute float aMainValue;
        attribute float aSize;
        attribute float aDefined;

        uniform float uStrokeWidth;

        varying float vSize;
        varying float vDefined;`,
    body: `
        vDefined = aDefined;
        vSize = 3.0 * sqrt(aSize / 3.14159);
        gl_PointSize = vSize + uStrokeWidth + 1.0;
        gl_Position = vec4(aCrossValue, aMainValue, 0, 1);`
};

export const square = {
    header: `
        attribute float aCrossValue;
        attribute float aMainValue;
        attribute float aSize;
        attribute float aDefined;

        uniform float uStrokeWidth;

        varying float vSize;
        varying float vDefined;`,
    body: `
        vDefined = aDefined;
        vSize = sqrt(aSize);
        gl_PointSize = vSize + uStrokeWidth + 1.0;
        gl_Position = vec4(aCrossValue, aMainValue, 0, 1);`
};

export const diamond = {
    header: `
        attribute float aCrossValue;
        attribute float aMainValue;
        attribute float aSize;
        attribute float aDefined;

        uniform float uStrokeWidth;

        varying float vSize;
        varying float vDefined;`,
    body: `
        vDefined = aDefined;
        vSize = sqrt(aSize);
        gl_PointSize = 2.0 * (vSize + uStrokeWidth + 1.0);
        gl_Position = vec4(aCrossValue, aMainValue, 0, 1);`
};

export const triangle = {
    header: `
        attribute float aCrossValue;
        attribute float aMainValue;
        attribute float aSize;
        attribute float aDefined;

        uniform float uStrokeWidth;

        varying float vSize;
        varying float vDefined;`,
    body: `
        vDefined = aDefined;
        vSize = sqrt((16.0 * aSize) / (3.0 * sqrt(3.0)));
        gl_PointSize = vSize + uStrokeWidth + 1.0;
        gl_Position = vec4(aCrossValue, aMainValue, 0, 1);`
};

export const cross = {
    header: `
        attribute float aCrossValue;
        attribute float aMainValue;
        attribute float aSize;
        attribute float aDefined;

        uniform float uStrokeWidth;

        varying float vSize;
        varying float vStrokeWidthRatio;
        varying float vDefined;`,
    body: `
        vDefined = aDefined;
        vSize = 3.0 * sqrt(aSize / 5.0);
        vStrokeWidthRatio = uStrokeWidth / (vSize + uStrokeWidth + 1.0);
        gl_PointSize = vSize + uStrokeWidth + 1.0;
        gl_Position = vec4(aCrossValue, aMainValue, 0, 1);`
};

export const candlestick = {
    header: `
        attribute float aCrossValue;
        attribute float aBandwidth;
        attribute float aHighValue;
        attribute float aOpenValue;
        attribute float aCloseValue;
        attribute float aLowValue;
        attribute vec3 aCorner;
        attribute float aDefined;

        uniform vec2 uScreen;
        uniform float uStrokeWidth;

        varying float vColorIndicator;
        varying float vDefined;`,
    body: `
        vDefined = aDefined;
        vColorIndicator = sign(aCloseValue - aOpenValue);

        float isPositiveY = (sign(aCorner.y) + 1.0) / 2.0;
        float isNotPositiveY = 1.0 - isPositiveY;
        float isExtremeY = abs(aCorner.y) - 1.0;
        float isNotExtremeY = 1.0 - isExtremeY;
        float yValue =
         (isPositiveY * isExtremeY * aLowValue) +
         (isPositiveY * isNotExtremeY * aCloseValue) +
         (isNotPositiveY * isNotExtremeY * aOpenValue) +
         (isNotPositiveY * isExtremeY * aHighValue);

        float lineWidthXDirection = (isNotExtremeY * aCorner.x) + (isExtremeY * aCorner.z);
        float lineWidthYDirection = isNotExtremeY * sign(aCloseValue - aOpenValue) * aCorner.y;

        float bandwidthModifier = aBandwidth * aCorner.x / 2.0;

        float xModifier = (uStrokeWidth * lineWidthXDirection / 2.0) + bandwidthModifier;
        float yModifier = uStrokeWidth * lineWidthYDirection / 2.0;

        gl_Position = vec4(aCrossValue, yValue, 0, 1);`
};

export const ohlc = {
    header: `
        attribute float aCrossValue;
        attribute float aBandwidth;
        attribute float aHighValue;
        attribute float aOpenValue;
        attribute float aCloseValue;
        attribute float aLowValue;
        attribute vec3 aCorner;
        attribute float aDefined;

        uniform vec2 uScreen;
        uniform float uStrokeWidth;

        varying float vColorIndicator;
        varying float vDefined;`,
    body: `
        vDefined = aDefined;
        vColorIndicator = sign(aCloseValue - aOpenValue);

        float isPositiveY = (sign(aCorner.y) + 1.0) / 2.0;
        float isNotPositiveY = 1.0 - isPositiveY;
        float isExtremeY = abs(aCorner.y) - 1.0;
        float isNotExtremeY = 1.0 - isExtremeY;
        float yValue =
            (isPositiveY * isExtremeY * aLowValue) +
            (isPositiveY * isNotExtremeY * aCloseValue) +
            (isNotPositiveY * isNotExtremeY * aOpenValue) +
            (isNotPositiveY * isExtremeY * aHighValue);

        float lineWidthXDirection = isExtremeY * aCorner.z;
        float lineWidthYDirection = isNotExtremeY * aCorner.z;

        float bandwidthModifier = isNotExtremeY * aCorner.x * aBandwidth / 2.0;

        float xModifier = (uStrokeWidth * lineWidthXDirection / 2.0) + bandwidthModifier;
        float yModifier = uStrokeWidth * lineWidthYDirection / 2.0;

        gl_Position = vec4(aCrossValue, yValue, 0, 1);`
};

export const bar = {
    header: `
        attribute float aCrossValue;
        attribute float aBandwidth;
        attribute float aMainValue;
        attribute float aBaseValue;
        attribute vec2 aCorner;
        attribute float aDefined;

        uniform vec2 uScreen;
        uniform float uStrokeWidth;

        varying float vDefined;`,
    body: `
        vDefined = aDefined;
        float isBaseline = (1.0 - aCorner.y) / 2.0;
        float yValue = (isBaseline * aBaseValue) + ((1.0 - isBaseline) * aMainValue);

        float xModifier = aCorner.x * (aBandwidth) / 2.0;

        gl_Position = vec4(aCrossValue, yValue, 0, 1);`
};

export const preScaleLine = {
    header: `
        attribute vec3 aCorner;
        attribute float aCrossNextNextValue;
        attribute float aMainNextNextValue;
        attribute float aCrossNextValue;
        attribute float aMainNextValue;
        attribute float aCrossValue;
        attribute float aMainValue;
        attribute float aCrossPrevValue;
        attribute float aMainPrevValue;
        attribute float aDefined;
        attribute float aDefinedNext;

        uniform float uStrokeWidth;
        uniform vec2 uScreen;

        varying float vDefined;`,
    body: `
        vDefined = aDefined * aDefinedNext;
        vec4 prev = vec4(aCrossPrevValue, aMainPrevValue, 0, 0);
        vec4 curr = vec4(aCrossValue, aMainValue, 0, 0);
        gl_Position = vec4(aCrossNextValue, aMainNextValue, 0, 1);
        vec4 nextNext = vec4(aCrossNextNextValue, aMainNextNextValue, 0, 0);`
};

export const postScaleLine = {
    body: `
        vec4 currVertexPosition = gl_Position;
        vec4 nextVertexPosition = gl_Position;

        if (all(equal(curr.xy, prev.xy))) {
            prev.xy = curr.xy + normalize(curr.xy - currVertexPosition.xy);
        }
        if (all(equal(curr.xy, currVertexPosition.xy))) {
            currVertexPosition.xy = curr.xy + normalize(curr.xy - prev.xy);
        }
        vec2 A = normalize(normalize(curr.xy - prev.xy) * uScreen);
        vec2 B = normalize(normalize(currVertexPosition.xy - curr.xy) * uScreen);
        vec2 tangent = normalize(A + B);
        vec2 miter = vec2(-tangent.y, tangent.x);
        vec2 normalA = vec2(-A.y, A.x);
        float miterLength = 1.0 / dot(miter, normalA);
        vec2 point = normalize(A - B);
        if (miterLength > 10.0 && sign(aCorner.x * dot(miter, point)) > 0.0) {
            currVertexPosition.xy = curr.xy - (aCorner.x * aCorner.y * uStrokeWidth * normalA) / uScreen.xy;
        } else {
            currVertexPosition.xy = curr.xy + (aCorner.x * miter * uStrokeWidth * miterLength) / uScreen.xy;
        }

        if (all(equal(nextVertexPosition.xy, curr.xy))) {
            curr.xy = nextVertexPosition.xy + normalize(nextVertexPosition.xy - nextNext.xy);
        }
        if (all(equal(nextVertexPosition.xy, nextNext.xy))) {
            nextNext.xy = nextVertexPosition.xy + normalize(nextVertexPosition.xy - curr.xy);
        }
        vec2 C = normalize(normalize(nextVertexPosition.xy - curr.xy) * uScreen);
        vec2 D = normalize(normalize(nextNext.xy - nextVertexPosition.xy) * uScreen);
        vec2 tangentCD = normalize(C + D);
        vec2 miterCD = vec2(-tangentCD.y, tangentCD.x);
        vec2 normalC = vec2(-C.y, C.x);
        float miterCDLength = 1.0 / dot(miterCD, normalC);
        vec2 pointCD = normalize(C - D);
        if (miterCDLength > 10.0 && sign(aCorner.x * dot(miterCD, pointCD)) > 0.0) {
            nextVertexPosition.xy = nextVertexPosition.xy - (aCorner.x * aCorner.y * uStrokeWidth * normalC) / uScreen.xy;
        } else {
            nextVertexPosition.xy = nextVertexPosition.xy + (aCorner.x * miterCD * uStrokeWidth * miterCDLength) / uScreen.xy;
        }

        gl_Position.xy = ((1.0 - aCorner.z) * currVertexPosition.xy) + (aCorner.z * nextVertexPosition.xy);`
};

export const errorBar = {
    header: `
        attribute vec3 aCorner;
        attribute float aCrossValue;
        attribute float aBandwidth;
        attribute float aHighValue;
        attribute float aLowValue;
        attribute float aDefined;

        uniform vec2 uScreen;
        uniform float uStrokeWidth;

        varying float vDefined;`,
    body: `
        vDefined = aDefined;
        float isLow = (aCorner.y + 1.0) / 2.0;
        float yValue = isLow * aLowValue + (1.0 - isLow) * aHighValue;

        float isEdgeCorner = abs(aCorner.x);
        float lineWidthXDirection = (1.0 - isEdgeCorner) * aCorner.z;
        float lineWidthYDirection = isEdgeCorner * aCorner.z;

        gl_Position = vec4(aCrossValue, yValue, 0, 1);

        float xModifier = (uStrokeWidth * lineWidthXDirection) + (aBandwidth * aCorner.x / 2.0);
        float yModifier = (uStrokeWidth * lineWidthYDirection);`
};

export const area = {
    header: `
        attribute vec3 aCorner;
        attribute float aCrossValue;
        attribute float aMainValue;
        attribute float aCrossNextValue;
        attribute float aMainNextValue;
        attribute float aBaseValue;
        attribute float aBaseNextValue;
        attribute float aDefined;
        attribute float aDefinedNext;

        varying float vDefined;

        float when_lt(float a, float b) {
            return max(sign(b - a), 0.0);
        }

        float and(float a, float b) {
            return a * b;
        }`,
    body: `
        vDefined = aDefined * aDefinedNext;
        gl_Position = vec4(0, 0, 0, 1);

        float hasIntercepted = when_lt((aMainNextValue - aBaseNextValue) * (aMainValue - aBaseValue), 0.0);
        float useIntercept = and(aCorner.z, hasIntercepted);

        float yGradient = (aMainNextValue - aMainValue) / (aCrossNextValue - aCrossValue);
        float yConstant = aMainNextValue - (yGradient * aCrossNextValue);

        float y0Gradient = (aBaseNextValue - aBaseValue) / (aCrossNextValue - aCrossValue);
        float y0Constant = aBaseNextValue - (y0Gradient * aCrossNextValue);

        float denominator = (yGradient - y0Gradient) + step(abs(yGradient - y0Gradient), 0.0);
        float interceptXValue = (y0Constant - yConstant) / denominator;
        float interceptYValue = (yGradient * interceptXValue) + yConstant;

        gl_Position = vec4(interceptXValue * useIntercept, interceptYValue * useIntercept, 0, 1);

        gl_Position.x += (1.0 - useIntercept) * ((aCorner.x * aCrossNextValue) + ((1.0 - aCorner.x) * aCrossValue));
        gl_Position.y += (1.0 - useIntercept) * (1.0 - aCorner.y) * ((aCorner.x * aMainNextValue) + ((1.0 - aCorner.x) * aMainValue));
        gl_Position.y += (1.0 - useIntercept) * aCorner.y * ((aCorner.x * aBaseNextValue) + ((1.0 - aCorner.x) * aBaseValue));`
};

export const boxPlot = {
    header: `
        attribute vec4 aCorner;
        attribute float aCrossValue;
        attribute float aBandwidth;
        attribute float aCapWidth;
        attribute float aHighValue;
        attribute float aUpperQuartileValue;
        attribute float aMedianValue;
        attribute float aLowerQuartileValue;
        attribute float aLowValue;
        attribute float aDefined;

        uniform vec2 uScreen;
        uniform float uStrokeWidth;

        varying float vDefined;
    `,
    body: `
        vDefined = aDefined;
        float isExtremeY = sign(abs(aCorner.y) - 2.0) + 1.0;
        float isNotExtremeY = 1.0 - isExtremeY;

        float isNonZeroY = abs(sign(aCorner.y));
        float isZeroY = 1.0 - isNonZeroY;

        float isQuartileY = isNotExtremeY * isNonZeroY;

        float isPositiveY = (sign(aCorner.y + 0.5) + 1.0) / 2.0;
        float isNegativeY = 1.0 - isPositiveY;

        float yValue =
          (isExtremeY * isNegativeY) * aHighValue +
          (isQuartileY * isNegativeY) * aUpperQuartileValue +
          isZeroY * aMedianValue +
          (isQuartileY * isPositiveY) * aLowerQuartileValue +
          (isExtremeY * isPositiveY) * aLowValue;

        gl_Position = vec4(aCrossValue, yValue, 0, 1);

        float isHorizontal = aCorner.w;
        float isVertical = 1.0 - isHorizontal;

        float xDisplacement = aCorner.x * (isExtremeY * aCapWidth + isNotExtremeY * aBandwidth) / 2.0;

        float xModifier = (isVertical * uStrokeWidth * aCorner.z / 2.0) + xDisplacement;
        float yModifier = isHorizontal * uStrokeWidth * aCorner.z / 2.0;`
};
