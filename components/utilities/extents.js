(function(d3, fc) {
    'use strict';

    /**
     * The extents function enhances the functionality of the equivalent D3 extents function, allowing
     * you to pass an array of fields which will be used to derive the extents of the supplied array. For
     * example, if you have an array of items with properties of 'high' and 'low', you
     * can use <code>fc.utilities.extents(data, ['high', 'low'])</code> to compute the extents of your data.
     *
     * @memberof fc.utilities
     * @param {array} data an array of data points
     * @param {array} fields the names of object properties that represent field values
     */
    fc.utilities.extents = function(data, fields) {

        // the function only operates on arrays, but we can pass non-array types in
        if (Object.prototype.toString.call(data) !== '[object Array]') {
            data = [data];
        }
        if (Object.prototype.toString.call(fields) !== '[object Array]') {
            fields = [fields];
        }

        // Return the smallest and largest
        return [
            d3.min(data, function(d) {
                return d3.min(fields.map(function(f) {
                    return d[f];
                }));
            }),
            d3.max(data, function(d) {
                return d3.max(fields.map(function(f) {
                    return d[f];
                }));
            })
        ];
    };
}(d3, fc));