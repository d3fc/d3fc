import { mat4 } from 'gl-matrix';

export default (scales) => {
    const modelViewMatrix = mat4.create();

    const scale = [1.0, 1.0, 1.0];
    const translate = [0.0, 0.0, 0.0];

    scales.forEach((axisScale, i) => {
        if (axisScale) {
            const adjust = getScaleAndOffset(axisScale);
            scale[i] = adjust.scale;
            translate[i] = adjust.offset;
        }
    });

    mat4.translate(modelViewMatrix, modelViewMatrix, translate);
    mat4.scale(modelViewMatrix, modelViewMatrix, scale);

    mat4.translate(modelViewMatrix, modelViewMatrix, [0.0, 0.0, -1.0]);

    return modelViewMatrix;
};

const getScaleAndOffset = axisScale => {
    const domain = axisScale.domain();
    const scale = 2.0 / (domain[1] - domain[0]);

    return {
        scale,
        offset: -scale * (domain[1] + domain[0]) / 2
    };
};
