(function(d3, fc) {
    'use strict';

    // This component provides a utility which allows other component to fail gracefully should a value
    // be passed for a data fields which does not exist in the data set.
    fc.utilities.valueAccessor = function(propertyName) {
        return function(d) {
            if (d.hasOwnProperty(propertyName)) {
                return d[propertyName];
            } else {
                if (typeof console === 'object') {
                    console.warn('The property with name ' + propertyName + ' was not found on the data object');
                }
                return 0;
            }
        };
    };
}(d3, fc));