export default () => {
    let pixelX = 1;
    let pixelY = 1;
    let lineWidth = 0;

    // Input is a Float32Array of triangle vertices (3 x/y vertices per triangle)
    // The first vertex of each triangle is considered the center, with the other
    // two being on the "edge"
    const edges = (positions) => {
        const edges = new Float32Array(positions.length);
        const edgeWidth = lineWidth - 1.0;
        for (let n = 0; n < positions.length; n += 6) {
            const dist1 = pixelDist(positions[n], positions[n + 1], positions[n + 2], positions[n + 3]);
            const dist2 = pixelDist(positions[n], positions[n + 1], positions[n + 4], positions[n + 5]);

            const diff = Math.sqrt(dist1 / dist2);

            const lw1 = edgeWidth * diff;
            const lw2 = edgeWidth / diff;

            const r1 = (dist1 - lw1);
            const r2 = (dist2 - lw2);

            edges[n] = 0;
            edges[n + 1] = (r1 + r2) / 2;
            edges[n + 2] = dist1;
            edges[n + 3] = r1;
            edges[n + 4] = dist2;
            edges[n + 5] = r2;
        }
        return edges;

    };

    const pixelDist = (x1, y1, x2, y2) => Math.sqrt(Math.pow((x2 - x1) / pixelX, 2) + Math.pow((y2 - y1) / pixelY, 2));

    edges.pixelX = (...args) => {
        if (!args.length) {
            return pixelX;
        }
        pixelX = args[0];
        return edges;
    };

    edges.pixelY = (...args) => {
        if (!args.length) {
            return pixelY;
        }
        pixelY = args[0];
        return edges;
    };

    edges.lineWidth = (...args) => {
        if (!args.length) {
            return lineWidth;
        }
        lineWidth = args[0];
        return edges;
    };

    return edges;
};
