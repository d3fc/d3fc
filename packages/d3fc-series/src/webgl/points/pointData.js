//
// Take an array of data and return a Float32Array of [x,y,size]
//
export default () => {
    let pointFn = (d) => ({ x: d.x, y: d.y, size: d.size });

    const pointData = (data) => {
        const result = new Float32Array(data.length * 3);
        let index = 0;

        data.forEach((d, i) => {
            const dataPoint = pointFn(d, i);
            result[index++] = dataPoint.x;
            result[index++] = dataPoint.y;
            result[index++] = dataPoint.size;
        });

        return result;
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
