/* global requestAnimationFrame:false */

// Debounce render to only occur once per frame
export default function(renderInternal) {
    var rafId = null;
    return function() {
        if (rafId == null) {
            rafId = requestAnimationFrame(function() {
                rafId = null;
                renderInternal();
            });
        }
    };
}
