// A margin is an object with top, left, bottom and right properties. Component
// margin properties can accept an integer, which is converted to a margin where each
// property equals the given value. Also, a margin may have properties missing, in
// which case they default to zero.
// This function expand an integer to a margin and fills missing properties.
export default function(margin) {
    var expandedMargin = margin;
    if (typeof(expandedMargin) === 'number') {
        expandedMargin = {
            top: margin,
            bottom: margin,
            left: margin,
            right: margin
        };
    }
    ['top', 'bottom', 'left', 'right'].forEach(function(direction) {
        if (!expandedMargin[direction]) {
            expandedMargin[direction] = 0;
        }
    });
    return expandedMargin;
}
