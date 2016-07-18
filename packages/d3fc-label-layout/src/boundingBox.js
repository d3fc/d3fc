export default () => {

    let bounds = [0, 0];

    const strategy = (data) => data.map((d, i) => {
        let tx = d.x;
        let ty = d.y;
        if (tx + d.width > bounds[0]) {
            tx -= d.width;
        }

        if (ty + d.height > bounds[1]) {
            ty -= d.height;
        }
        return {height: d.height, width: d.width, x: tx, y: ty};
    });

    strategy.bounds = (...args) => {
        if (!args.length) {
            return bounds;
        }
        bounds = args[0];
        return strategy;
    };

    return strategy;
};
