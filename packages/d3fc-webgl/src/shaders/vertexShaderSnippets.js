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
    header: `attribute float aXVertex;
             attribute float aYVertex;
             attribute float aSize;
             varying float vSize;`,
    body: `vSize = aSize;
           gl_PointSize = vSize;
           gl_Position = vec4(aXVertex, aYVertex, 0, 1);`
};
