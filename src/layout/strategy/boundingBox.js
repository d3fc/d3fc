export default function() {

    var bounds = null;

    var strategy = function(data) {
        return data.map(function(d, i) {

            var tx = d.x, ty = d.y;
            if (tx + d.width > bounds[0]) {
                tx -= d.width;
            }

            if (ty + d.height > bounds[1]) {
                ty -= d.height;
            }
            return {x: tx, y: ty};
        });
    };

    strategy.bounds = function(value) {
        if (!arguments.length) {
            return bounds;
        }
        bounds = value;
        return strategy;
    };

    return strategy;
}
