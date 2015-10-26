// returns the width and height of the given element minus the padding.
export default function (element) {
    var style = element.ownerDocument.defaultView.getComputedStyle(element);
    return {
        width: parseFloat(style.width) - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight),
        height: parseFloat(style.height) - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom)
    };
}
