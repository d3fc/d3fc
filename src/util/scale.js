export function isOrdinal(scale) {
    return scale.rangeExtent;
}

// ordinal axes have a rangeExtent function, this adds any padding that
// was applied to the range. This functions returns the rangeExtent
// if present, or range otherwise
export function range(scale) {
    return isOrdinal(scale) ? scale.rangeExtent() : scale.range();
}
