(function(d3, fc) {
    'use strict';

    /**
     * Utility methods for convinient object operations.
     *
     * @namespace fc.utilities.object
     */
    fc.utilities.object = {};

    fc.utilities.object.keys = function(obj) {
        var keys = [];
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                keys.push(key);
            }
        }
        return keys;
    };

}(d3, fc));