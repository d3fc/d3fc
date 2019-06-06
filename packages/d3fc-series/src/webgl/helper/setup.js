import { mat4 } from 'gl-matrix';

export default (gl) => {
    const projectionMatrix = mat4.create();

        // Create a perspective matrix, a special matrix that is
        // used to simulate the distortion of perspective in a camera.
        // Our field of view is 45 degrees, with a width/height
        // ratio that matches the display size of the canvas
        // and we only want to see objects between 0.1 units
        // and 100 units away from the camera.
    const fieldOfView = 90 * Math.PI / 180;   // in radians
    const aspect = 1; // gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;

        // note: glmatrix.js always has the first argument
        // as the destination to receive the result.
    mat4.perspective(projectionMatrix,
            fieldOfView,
            aspect,
            zNear,
            zFar);

    // Enable blending semi-transparent colors
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    return { projectionMatrix };
};
