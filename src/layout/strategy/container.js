export default function() {
    var bounds = null;

    var container = function(point) {
        var width = bounds[0], height = bounds[1];
        // If the bounds haven't been defined, then don't enforce
        return (width == null && height == null) ||
            (!(point.x < 0 || point.y < 0 ||
            point.x > width || point.y > height ||
            (point.x + point.width) > width ||
            (point.y + point.height) > height));
    };

    container.area = function() {
        return bounds[0] * bounds[1];
    };

    container.bounds = function(value) {
        if (!arguments.length) {
            return bounds;
        }
        bounds = value;
        return container;
    };

    return container;
}
