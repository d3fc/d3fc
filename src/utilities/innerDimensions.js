(function(d3, fc) {
    'use strict';

    // returns the width and height of the given element minus the padding.
    fc.utilities.innerDimensions = function(element) {
        var style = getComputedStyle(element);
        return {
            width: parseFloat(style.width) - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight),
            height: parseFloat(style.height) - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom)
        };
    };
}(d3, fc));