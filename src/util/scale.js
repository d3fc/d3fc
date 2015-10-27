export function isOrdinal(scale) {
    return scale.rangeExtent;
}

// ordinal axes have a rangeExtent function, this adds any padding that
// was applied to the range. This functions returns the rangeExtent
// if present, or range otherwise
export function range(scale) {
    return isOrdinal(scale) ? scale.rangeExtent() : scale.range();
}

// Ordinal and quantitative scales have different methods for setting the range. This
// function detects the scale type and sets the range accordingly.
export function setRange(scale, range) {
    if (isOrdinal(scale)) {
        scale.rangePoints(range, 1);
    } else {
        scale.range(range);
    }
}
