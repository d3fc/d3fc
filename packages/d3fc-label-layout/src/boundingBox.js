export default () => {

    var bounds = [0, 0];

    var strategy = (data) => data.map((d, i) => {
        var tx = d.x;
        var ty = d.y;
        if (tx + d.width > bounds[0]) {
            tx -= d.width;
        }

        if (ty + d.height > bounds[1]) {
            ty -= d.height;
        }
        return {height: d.height, width: d.width, x: tx, y: ty};
    });

    strategy.bounds = function(value) {
        if (!arguments.length) {
            return bounds;
        }
        bounds = value;
        return strategy;
    };

    return strategy;
};
