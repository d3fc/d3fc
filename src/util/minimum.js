// searches for a minimum when applying the given accessor to each item within the supplied array.
// The returned array has the following form:
// [minumum accessor value, datum, index]
export default function minimum(data, accessor) {
    return data.map(function(dataPoint, index) {
        return [accessor(dataPoint, index), dataPoint, index];
    }).reduce(function(accumulator, dataPoint) {
        return accumulator[0] > dataPoint[0] ? dataPoint : accumulator;
    }, [Number.MAX_VALUE, null, -1]);
}
