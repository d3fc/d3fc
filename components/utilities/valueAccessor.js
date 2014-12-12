(function(d3, fc) {
    'use strict';

    /**
    * This component provides a utility which allows other component to fail gracefully should a value
    * be passed for a data fields which does not exist in the data set.
    *
    * @type {function}
    * @memberof fc.utilities
    * @namespace fc.utilities.valueAccessor
    * @param {string} propertyName the name of the property in the data set we are trying to use.
    * @returns a function which returns the value of the named property/field from the data item if it exists or 0
    * if it does not. Should it not exist the function will also log a message in the JavaScript console.
    */
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