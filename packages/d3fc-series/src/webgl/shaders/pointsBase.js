import {rebindAll, exclude} from '@d3fc/d3fc-rebind';
import baseShader from './base';

// Base shader for rendering points

export default (gl, vsSource, fsSource) => {
    const base = baseShader(gl, vsSource, fsSource).numComponents(3);

    let lastWidth = -1;
    let lastStrokeColor = [-1, -1, -1, -1];

    const edgeColorLocation = gl.getUniformLocation(base.shaderProgram(), 'uEdgeColor');
    const lineWidthLocation = gl.getUniformLocation(base.shaderProgram(), 'uLineWidth');

    const draw = (positions, color, lineWidth = 0, strokeColor = null) => {
        const fColor = color || [0.0, 0.0, 0.0, 0.0];
        const sColor = strokeColor || fColor;
        if ((lineWidth !== lastWidth) ||
                sColor.some((c, i) => c !== lastStrokeColor[i])) {
            setColor(lineWidth, sColor);
            lastWidth = lineWidth;
            lastStrokeColor = sColor;
        }

        base(positions, color, gl.POINTS);
    };

    draw.activate = () => {
        base.activate();
        lastStrokeColor = [-1, -1, -1, -1];
    };

    function setColor(lineWidth, strokeColor) {
        gl.uniform4fv(
            edgeColorLocation,
            strokeColor);
        gl.uniform1f(
            lineWidthLocation,
            lineWidth);
    }

    rebindAll(draw, base, exclude('activate'));
    return draw;
};
