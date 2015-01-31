(function(d3, fc) {
    'use strict';

    /**
     * The extent function enhances the functionality of the equivalent D3 extent function, allowing
     * you to pass an array of fields which will be used to derive the extent of the supplied array. For
     * example, if you have an array of items with properties of 'high' and 'low', you
     * can use <code>fc.utilities.extent(data, ['high', 'low'])</code> to compute the extent of your data.
     *
     * @memberof fc.utilities
     * @param {array} data an array of data points, or an array of arrays of data points
     * @param {array} fields the names of object properties that represent field values
     */
    fc.utilities.extent = function(data, fields) {

        if (fields === null) {
            return d3.extent(data);
        }

        // the function only operates on arrays of arrays, but we can pass non-array types in
        if (!Array.isArray(data)) {
            data = [data];
        }
        // we need an array of arrays if we don't have one already
        if (!Array.isArray(data[0])) {
            data = [data];
        }
        // the fields parameter must be an array of field names, but we can pass non-array types in
        if (!Array.isArray(fields)) {
            fields = [fields];
        }

        // Return the smallest and largest
        return [
            d3.min(data, function(d0) {
                return d3.min(d0, function(d1) {
                    return d3.min(fields.map(function(f) {
                        return d1[f];
                    }));
                });
            }),
            d3.max(data, function(d0) {
                return d3.max(d0, function(d1) {
                    return d3.max(fields.map(function(f) {
                        return d1[f];
                    }));
                });
            })
        ];
    };
}(d3, fc));