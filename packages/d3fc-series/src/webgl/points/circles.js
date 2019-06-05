import edges from './edges';

export default () => {
    let pixelX = 1;
    let pixelY = 1;
    let lineWidth = 0;
    let callback = () => { };

    const circles = (data, totalSegments) => {
        const points = new Float32Array(totalSegments * 6);

        let index = 0;
        let target = 0;

        while (index < data.length) {
            const x = data[index++];
            const y = data[index++];
            const size = data[index++];
            const segments = data[index++];

            const sizeX = size * pixelX;
            const sizeY = size * pixelY;

            let lastX = x;
            let lastY = y + sizeY;

            for (let n = 0; n < segments; n++) {
                const angle = 2 * (n + 1) * Math.PI / segments;

                points[target++] = x;
                points[target++] = y;
                points[target++] = lastX;
                points[target++] = lastY;

                lastX = x + Math.sin(angle) * sizeX;
                lastY = y + Math.cos(angle) * sizeY;

                points[target++] = lastX;
                points[target++] = lastY;
            }
        }

        let edgesData = null;
        if (lineWidth > 0) {
            edgesData = edges()
                .pixelX(pixelX)
                .pixelY(pixelY)
                .lineWidth(lineWidth)(points);
        }

        callback(points, edgesData);
    };

    circles.pixelX = (...args) => {
        if (!args.length) {
            return pixelX;
        }
        pixelX = args[0];
        return circles;
    };

    circles.pixelY = (...args) => {
        if (!args.length) {
            return pixelY;
        }
        pixelY = args[0];
        return circles;
    };

    circles.lineWidth = (...args) => {
        if (!args.length) {
            return lineWidth;
        }
        lineWidth = args[0];
        return circles;
    };

    circles.callback = (...args) => {
        if (!args.length) {
            return callback;
        }
        callback = args[0];
        return circles;
    };

    return circles;
};
