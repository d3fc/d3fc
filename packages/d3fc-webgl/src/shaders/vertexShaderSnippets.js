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

export const candlestick = {
    header: `
        attribute float aXValue;
        attribute float aHigh;
        attribute float aOpen;
        attribute float aClose;
        attribute float aLow;
        attribute float aBandwidth;
        attribute vec3 aCorner;
    
        varying float vColorIndicator;
        uniform vec2 uScreen;
        uniform float uLineWidth;`,
    body: `
        vColorIndicator = sign(aClose - aOpen);

        float isPositiveY = (sign(aCorner.y) + 1.0) / 2.0;
        float isNotPositiveY = 1.0 - isPositiveY;
        float isExtremeY = abs(aCorner.y) - 1.0;
        float isNotExtremeY = 1.0 - isExtremeY;
        float yValue = (isPositiveY * isExtremeY * aLow) + (isPositiveY * isNotExtremeY * aClose) + (isNotPositiveY * isNotExtremeY * aOpen) + (isNotPositiveY * isExtremeY * aHigh);

        float xDirection = (isNotExtremeY * aCorner.x) + (isExtremeY * aCorner.z);
        float yDirection = isNotExtremeY * sign(aClose - aOpen) * aCorner.y;

        float bandwidthModifier = aBandwidth * aCorner.x / 2.0;

        float xModifier = (uLineWidth * xDirection / 2.0) + bandwidthModifier;
        float yModifier = uLineWidth * yDirection / 2.0;

        gl_Position = vec4(aXValue, yValue, 0, 1);`
};

export const ohlc = {
    header: `
      attribute float aXValue;
      attribute float aHigh;
      attribute float aOpen;
      attribute float aClose;
      attribute float aLow;
      attribute float aBandwidth;
      attribute vec3 aCorner;
  
      varying float vColorIndicator;
      uniform vec2 uScreen;
      uniform float uLineWidth;`,
    body: `
      vColorIndicator = sign(aClose - aOpen);

      float isPositiveY = (sign(aCorner.y) + 1.0) / 2.0;
      float isNotPositiveY = 1.0 - isPositiveY;
      float isExtremeY = abs(aCorner.y) - 1.0;
      float isNotExtremeY = 1.0 - isExtremeY;
      float yValue = (isPositiveY * isExtremeY * aLow) + (isPositiveY * isNotExtremeY * aClose) + (isNotPositiveY * isNotExtremeY * aOpen) + (isNotPositiveY * isExtremeY * aHigh);

      float xDirection = isExtremeY * aCorner.z;
      float yDirection = isNotExtremeY * aCorner.z;

      float bandwidthModifier = isNotExtremeY * aCorner.x * aBandwidth / 2.0;

      float xModifier = (uLineWidth * xDirection / 2.0) + bandwidthModifier;
      float yModifier = uLineWidth * yDirection / 2.0;

      gl_Position = vec4(aXValue, yValue, 0, 1);`
};

export const bar = {
    header: `attribute float aXValue;
        attribute float aY0Value;
        attribute float aYValue;
        attribute float aWidthValue;
        attribute vec2 aCorner;
        
        uniform vec2 uScreen;
        uniform float uLineWidth;`,
    body: `
        float isBaseline = (1.0 - aCorner.y) / 2.0;
        float yValue = (isBaseline * aY0Value) + ((1.0 - isBaseline) * aYValue);

        float xModifier = aCorner.x * (aWidthValue) / 2.0;

        gl_Position = vec4(aXValue, yValue, 0, 1);
        `
};

export const preScaleLine = {
    header: `uniform float uLineWidth;
        uniform vec2 uScreen;
        attribute vec3 aCorner;
        attribute float aNextXValue; attribute float aNextYValue;
        attribute float aXValue; attribute float aYValue;
        attribute float aPrevXValue; attribute float aPrevYValue;
        attribute float aPrevPrevXValue; attribute float aPrevPrevYValue;
        attribute float aDefined;
        varying float vDefined;`,
    body: `vDefined = aDefined;
        vec4 next = vec4(aNextXValue, aNextYValue, 0, 0);
        gl_Position = vec4(aXValue, aYValue, 0, 1);
        vec4 prev = vec4(aPrevXValue, aPrevYValue, 0, 0);
        vec4 prevPrev = vec4(aPrevPrevXValue, aPrevPrevYValue, 0, 0);`
};

export const postScaleLine = {
    body: `vec4 prevVertexPosition = gl_Position;
        vec4 currVertexPosition = gl_Position;
        
        if (all(equal(prev.xy, prevPrev.xy))) {
            prevPrev.xy = prev.xy + normalize(prev.xy - prevVertexPosition.xy);
        }
        if (all(equal(prev.xy, prevVertexPosition.xy))) {
            prevVertexPosition.xy = prev.xy + normalize(prev.xy - prevPrev.xy);
        }
        vec2 A = normalize(normalize(prev.xy - prevPrev.xy) * uScreen);
        vec2 B = normalize(normalize(prevVertexPosition.xy - prev.xy) * uScreen);
        vec2 tangent = normalize(A + B);
        vec2 miter = vec2(-tangent.y, tangent.x);
        vec2 normalA = vec2(-A.y, A.x);
        float miterLength = 1.0 / dot(miter, normalA);
        vec2 point = normalize(A - B);
        if (miterLength > 10.0 && sign(aCorner.x * dot(miter, point)) > 0.0) {
            prevVertexPosition.xy = prev.xy - (aCorner.x * aCorner.y * uLineWidth * normalA) / uScreen.xy;
        } else {
            prevVertexPosition.xy = prev.xy + (aCorner.x * miter * uLineWidth * miterLength) / uScreen.xy;
        }

        if (all(equal(currVertexPosition.xy, prev.xy))) {
            prev.xy = currVertexPosition.xy + normalize(currVertexPosition.xy - next.xy);
        }
        if (all(equal(currVertexPosition.xy, next.xy))) {
            next.xy = currVertexPosition.xy + normalize(currVertexPosition.xy - prev.xy);
        }
        vec2 C = normalize(normalize(currVertexPosition.xy - prev.xy) * uScreen);
        vec2 D = normalize(normalize(next.xy - currVertexPosition.xy) * uScreen);
        vec2 tangentCD = normalize(C + D);
        vec2 miterCD = vec2(-tangentCD.y, tangentCD.x);
        vec2 normalC = vec2(-C.y, C.x);
        float miterCDLength = 1.0 / dot(miterCD, normalC);
        vec2 pointCD = normalize(C - D);
        if (miterCDLength > 10.0 && sign(aCorner.x * dot(miterCD, pointCD)) > 0.0) {
            currVertexPosition.xy = currVertexPosition.xy - (aCorner.x * aCorner.y * uLineWidth * normalC) / uScreen.xy;
        } else {
            currVertexPosition.xy = currVertexPosition.xy + (aCorner.x * miterCD * uLineWidth * miterCDLength) / uScreen.xy;
        }
        
        gl_Position.xy = ((1.0 - aCorner.z) * prevVertexPosition.xy) + (aCorner.z * currVertexPosition.xy);`
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
        
        float xModifier = (uLineWidth * lineWidthXDirection) + (aBandwidth * aCorner.x / 2.0);
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
    header: `
        attribute float aXValue;
        attribute float aHigh;
        attribute float aUpperQuartile;
        attribute float aMedian;
        attribute float aLowerQuartile;
        attribute float aLow;
        attribute float aBandwidth;
        attribute float aCapWidth;
        attribute vec4 aCorner;
        uniform vec2 uScreen;
        uniform float uLineWidth;`,
    body: `   
        float isExtremeY = sign(abs(aCorner.y) - 2.0) + 1.0;
        float isNotExtremeY = 1.0 - isExtremeY;

        float isNonZeroY = abs(sign(aCorner.y));
        float isZeroY = 1.0 - isNonZeroY;

        float isQuartileY = isNotExtremeY * isNonZeroY;

        float isPositiveY = (sign(aCorner.y + 0.5) + 1.0) / 2.0;
        float isNegativeY = 1.0 - isPositiveY;

        float yValue =
          (isExtremeY * isNegativeY) * aHigh +
          (isQuartileY * isNegativeY) * aUpperQuartile +
          isZeroY * aMedian +
          (isQuartileY * isPositiveY) * aLowerQuartile +
          (isExtremeY * isPositiveY) * aLow;

        gl_Position = vec4(aXValue, yValue, 0, 1);

        float isHorizontal = aCorner.w;
        float isVertical = 1.0 - isHorizontal;

        float xDisplacement = aCorner.x * (isExtremeY * aCapWidth + isNotExtremeY * aBandwidth) / 2.0;
        
        float xModifier = (isVertical * uLineWidth * aCorner.z / 2.0) + xDisplacement;
        float yModifier = isHorizontal * uLineWidth * aCorner.z / 2.0;
        `
};
