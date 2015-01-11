(function(d3, fc) {
    'use strict';

    // a property that follows the D3 component convention for accessors
    // see: http://bost.ocks.org/mike/chart/
    fc.utilities.property = function(initialValue) {

        var accessor = function(newValue) {
            if (!arguments.length) {
                return accessor.value;
            }
            accessor.value = newValue;
            return this;
        };

        accessor.value = initialValue;

        return accessor;
    };

    // a property that follows the D3 component convention for accessors
    // see: http://bost.ocks.org/mike/chart/
    fc.utilities.functorProperty = function(initialValue) {

        var accessor = function(newValue) {
            if (!arguments.length) {
                return accessor.value;
            }
            accessor.value = d3.functor(newValue);
            return this;
        };

        accessor.value = d3.functor(initialValue);

        return accessor;
    };
}(d3, fc));