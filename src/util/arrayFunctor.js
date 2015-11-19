import d3 from 'd3';

// applies the d3.functor to each element of an array, allowing a mixed
// of functions and constants, e.g.
// [0, function(d) { return d.foo; }]
export default function functoredArray(x) {
    var functoredItems = x.map(function(item) {
        return d3.functor(item);
    });
    return function(d, i) {
        return functoredItems.map(function(j) {
            return j(d, i);
        });
    };
}
