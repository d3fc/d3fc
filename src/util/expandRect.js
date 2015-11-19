// A rectangle is an object with top, left, bottom and right properties. Component
// margin or padding properties can accept an integer, which is converted to a rectangle where each
// property equals the given value. Also, a margin / padding may have properties missing, in
// which case they default to zero.
// This function expand an integer to a rectangle and fills missing properties.
export default function(margin) {
    var expandedRect = margin;
    if (typeof(expandedRect) === 'number') {
        expandedRect = {
            top: margin,
            bottom: margin,
            left: margin,
            right: margin
        };
    }
    ['top', 'bottom', 'left', 'right'].forEach(function(direction) {
        if (!expandedRect[direction]) {
            expandedRect[direction] = 0;
        }
    });
    return expandedRect;
}
