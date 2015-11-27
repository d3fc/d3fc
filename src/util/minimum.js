export default function minimum(data, accessor) {
    // Build up the additional arguments to call on accessor (saves having to call .bind())
    // https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#3-managing-arguments
    var extraArguments = [];
    for (var i = 2; i < arguments.length; i++) {
        extraArguments.push(arguments[i]);
    }
    return data.map(function(dataPoint) {
        return [accessor.apply(this, [dataPoint].concat(extraArguments)), dataPoint];
    }).reduce(function(accumulator, dataPoint) {
        return accumulator[0] > dataPoint[0] ? dataPoint : accumulator;
    }, [Number.MAX_VALUE, null])[1];
}
