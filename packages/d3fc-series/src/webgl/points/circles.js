import edges from './edges';

//
// Generate the triangle data needed to render a set of circles
//
export default () => {
    let pixelX = 1;
    let pixelY = 1;
    let lineWidth = 0;
    let callback = () => { };

    // Input should be a Float32Array of [x,y,size]
    const circles = (data) => {
        const circleCount = data.length / 3;
        const segmentsCounts = getSegmentCounts(data);
        const points = new Float32Array(segmentsCounts.total * 6);

        let index = 0;
        let target = 0;

        for (let n = 0; n < circleCount; n++) {
            const x = data[index++];
            const y = data[index++];
            const size = data[index++];
            const segments = segmentsCounts.counts[n];

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

            // pixel-correction for the last two (prevents overlaps)
            points[target - 2] = x;
            points[target - 1] = y + sizeY;
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

    const getSegmentCounts = data => {
        // Number of each circle's segments depends on its size
        const circleCount = data.length / 3;
        const counts = new Float32Array(data.length / 3);
        let total = 0;
        let index = 0;
        for (let n = 0; n < circleCount; n++) {
            index += 2;
            const size = data[index++];
            const count = Math.max(8, Math.floor(size * 1.5));

            counts[n] = count;
            total += count;
        }

        return { total, counts };
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
