export default () => {
    let circles = false;
    let pointFn = (d) => ({ x: d.x, y: d.y, size: d.size });

    const pointData = (data) => {
        const dataPerPoint = circles ? 4 : 3;
        const result = new Float32Array(data.length * dataPerPoint);
        let allSegments = 0;
        let index = 0;

        data.forEach((d, i) => {
            const dataPoint = pointFn(d, i);
            result[index++] = dataPoint.x;
            result[index++] = dataPoint.y;

            // Adjust to match the size with the d3-shapes
            const size = Math.sqrt(dataPoint.size) * 0.65;
            result[index++] = size;

            if (circles) {
                const segments = Math.floor(size * 2);
                result[index++] = segments;
                allSegments += segments;
            }
        });

        return {
            data: result,
            segmentCount: allSegments
        };
    };

    pointData.circles = (...args) => {
        if (!args.length) {
            return circles;
        }
        circles = args[0];
        return pointData;
    };

    pointData.pointFn = (...args) => {
        if (!args.length) {
            return pointFn;
        }
        pointFn = args[0];
        return pointData;
    };

    return pointData;
};
