import edges from './edges';

//
// Generate the triangle data needed to render a set of shapes
//
export default () => {
    let pixelX = 1;
    let pixelY = 1;
    let lineWidth = 0;
    let shape = [];
    let callback = () => { };

    // Input should be a Float32Array of [x,y,size]
    const shapes = (data) => {
        const trianglesPerShape = (shape.length / 2 - 1);
        const points = new Float32Array(data.length * trianglesPerShape * 6);

        let index = 0;
        let target = 0;
        while (index < data.length) {
            const x = data[index++];
            const y = data[index++];
            const size = data[index++];

            for (let n = 0; n < shape.length - 2; n += 2) {
                points[target++] = x;
                points[target++] = y;

                points[target++] = x + shape[n] * size * pixelX;
                points[target++] = y - shape[n + 1] * size * pixelY;

                points[target++] = x + shape[n + 2] * size * pixelX;
                points[target++] = y - shape[n + 3] * size * pixelY;
            }
        };

        let edgesData = null;
        if (lineWidth > 0) {
            edgesData = edges()
                .pixelX(pixelX)
                .pixelY(pixelY)
                .lineWidth(lineWidth)(points);
        }

        callback(points, edgesData);
    };

    shapes.pixelX = (...args) => {
        if (!args.length) {
            return pixelX;
        }
        pixelX = args[0];
        return shapes;
    };

    shapes.pixelY = (...args) => {
        if (!args.length) {
            return pixelY;
        }
        pixelY = args[0];
        return shapes;
    };

    shapes.lineWidth = (...args) => {
        if (!args.length) {
            return lineWidth;
        }
        lineWidth = args[0];
        return shapes;
    };

    shapes.shape = (...args) => {
        if (!args.length) {
            return shape;
        }
        shape = args[0];
        return shapes;
    };

    shapes.callback = (...args) => {
        if (!args.length) {
            return callback;
        }
        callback = args[0];
        return shapes;
    };

    return shapes;
};
