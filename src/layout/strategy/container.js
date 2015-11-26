export default function() {
    var containerWidth = 0,
        containerHeight = 0;

    var container = function(point) {
        return !(point.x < 0 || point.y < 0 ||
            point.x > containerWidth || point.y > containerHeight ||
            (point.x + point.width) > containerWidth ||
            (point.y + point.height) > containerHeight);
    };

    container.containerWidth = function(value) {
        if (!arguments.length) {
            return containerWidth;
        }
        containerWidth = value;
        return container;
    };

    container.containerHeight = function(value) {
        if (!arguments.length) {
            return containerHeight;
        }
        containerHeight = value;
        return container;
    };

    return container;
}
