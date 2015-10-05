import d3 from 'd3';

/**
 * The extent function enhances the functionality of the equivalent D3 extent function, allowing
 * you to pass an array of fields, or accessors, which will be used to derive the extent of the supplied array. For
 * example, if you have an array of items with properties of 'high' and 'low', you
 * can use <code>fc.util.extent(data, ['high', 'low'])</code> to compute the extent of your data.
 *
 * @memberof fc.util
 * @param {array} data an array of data points, or an array of arrays of data points
 * @param {array} fields the names of object properties that represent field values, or accessor functions.
 */
export default function(data, fields) {

    // we need an array of arrays if we don't have one already
    if (!Array.isArray(data[0])) {
        data = [data];
    }
    if (arguments.length === 2) {
        // the fields parameter must be an array of field names, but we can pass non-array types in
        if (!Array.isArray(fields)) {
            fields = [fields];
        }
    } else {
        // for > 2 args, construct the fields
        var args = Array.prototype.slice.call(arguments);
        fields = args.slice(1);
    }

    // the fields can be a mixed array of property names or accessor functions
    fields = fields.map(function(field) {
        if (typeof field !== 'string') {
            return field;
        }
        return function(d) {
            return d[field];
        };
    });

    // Return the smallest and largest
    return [
        d3.min(data, function(d0) {
            return d3.min(d0, function(d1) {
                return d3.min(fields.map(function(f) {
                    return f(d1);
                }));
            });
        }),
        d3.max(data, function(d0) {
            return d3.max(d0, function(d1) {
                return d3.max(fields.map(function(f) {
                    return f(d1);
                }));
            });
        })
    ];
}
