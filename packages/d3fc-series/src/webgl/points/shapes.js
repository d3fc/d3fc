import { symbol } from 'd3-shape';
import edges from './edges';

//
// Generate the triangle data needed to render a set of shapes
//
export default () => {
    let pixelX = 1;
    let pixelY = 1;
    let lineWidth = 0;
    let type = null;
    let callback = () => { };

    // Input should be a Float32Array of [x,y,size]
    const shapes = (data) => {
        const shape = shapeToPoints(type);
        const trianglesPerShape = (shape.length / 2 - 1);
        const points = new Float32Array(data.length * trianglesPerShape * 6);

        let index = 0;
        let target = 0;
        while (index < data.length) {
            const x = data[index++];
            const y = data[index++];
            const size = Math.sqrt(data[index++]);

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

    shapes.type = (...args) => {
        if (!args.length) {
            return type;
        }
        type = args[0];
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

function shapeToPoints(d3Shape) {
    const shapeSymbol = symbol().type(d3Shape);
    const shapePath = shapeSymbol.size(1)();
    const points = shapePath
        .substring(1, shapePath.length - 1)
        .split('L')
        .map(p => p.split(',').map(c => parseFloat(c)));

    if (points.length === 1) {
        // Square
        const l = -points[0][0];
        points.push([l, -l]);
        points.push([l, l]);
        points.push([-l, l]);
    }

    points.push(points[0]);
    return Float32Array.from(points.reduce((acc, val) => acc.concat(val), []));
}
