(function(d3, fc) {
    'use strict';

    // returns the width and height of the given element minus the padding.
    fc.util.innerDimensions = function(element) {
        var style = element.ownerDocument.defaultView.getComputedStyle(element);
        return {
            width: parseFloat(style.width) - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight),
            height: parseFloat(style.height) - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom)
        };
    };
}(d3, fc));
