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

export const point = {
    header: `varying float vSize;
             uniform float uEdgeSize;`,
    body: `vSize = 2.0 * sqrt(aVertexPosition.z / 3.14159);
           gl_PointSize = vSize + uEdgeSize + 1.0;
           gl_Position = vec4(aVertexPosition.xy, 0, 1);`
};
