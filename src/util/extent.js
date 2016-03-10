import d3 from 'd3';

/**
 * The extent function enhances the functionality of the equivalent D3 extent function, allowing
 * you to pass an array of fields, or accessors, which will be used to derive the extent of the supplied array. For
 * example, if you have an array of items with properties of 'high' and 'low', you
 * can use <code>fc.util.extent().fields(['high', 'low'])(data)</code> to compute the extent of your data.
 *
 * @memberof fc.util
 */
export default function() {

    var fields = [],
        extraPoints = [],
        padUnit = 'percent',
        pad = 0,
        symmetricalAbout = null;

    /**
    * @param {array} data an array of data points, or an array of arrays of data points
    */
    var extents = function(data) {

        // we need an array of arrays if we don't have one already
        if (!Array.isArray(data[0])) {
            data = [data];
        }

        // the fields can be a mixed array of property names or accessor functions
        var mutatedFields = fields.map(function(field) {
            if (typeof field !== 'string') {
                return field;
            }
            return function(d) {
                return d[field];
            };
        });

        var dataMin = d3.min(data, function(d0) {
            return d3.min(d0, function(d1) {
                return d3.min(mutatedFields.map(function(f) {
                    return f(d1);
                }));
            });
        });

        var dataMax = d3.max(data, function(d0) {
            return d3.max(d0, function(d1) {
                return d3.max(mutatedFields.map(function(f) {
                    return f(d1);
                }));
            });
        });

        var dateExtent = Object.prototype.toString.call(dataMin) === '[object Date]';

        var min = dateExtent ? dataMin.getTime() : dataMin;
        var max = dateExtent ? dataMax.getTime() : dataMax;

        // apply symmetry rules
        if (symmetricalAbout != null) {
            var symmetrical = dateExtent ? symmetricalAbout.getTime() : symmetricalAbout;
            var distanceFromMax = Math.abs(max - symmetrical),
                distanceFromMin = Math.abs(min - symmetrical),
                halfRange = Math.max(distanceFromMax, distanceFromMin);

            min = symmetrical - halfRange;
            max = symmetrical + halfRange;
        }

        if (padUnit === 'domain') {
            // pad absolutely
            if (Array.isArray(pad)) {
                min -= pad[0];
                max += pad[1];
            } else {
                min -= pad;
                max += pad;
            }
        } else if (padUnit === 'percent') {
            // pad percentagely
            if (Array.isArray(pad)) {
                var deltaArray = [pad[0] * (max - min), pad[1] * (max - min)];
                min -= deltaArray[0];
                max += deltaArray[1];
            } else {
                var delta = pad * (max - min) / 2;
                min -= delta;
                max += delta;
            }
        }

        if (extraPoints.length) {
            min = Math.min(min, d3.min(extraPoints));
            max = Math.max(max, d3.max(extraPoints));
        }

        if (dateExtent) {
            min = new Date(min);
            max = new Date(max);
        }

        // Return the smallest and largest
        return [min, max];
    };

    /*
    * @param {array} fields the names of object properties that represent field values, or accessor functions.
    */
    extents.fields = function(x) {
        if (!arguments.length) {
            return fields;
        }
        fields = x;
        return extents;
    };

    extents.include = function(x) {
        if (!arguments.length) {
            return extraPoints;
        }
        extraPoints = x;
        return extents;
    };

    extents.padUnit = function(x) {
        if (!arguments.length) {
            return padUnit;
        }
        padUnit = x;
        return extents;
    };

    extents.pad = function(x) {
        if (!arguments.length) {
            return pad;
        }
        pad = x;
        return extents;
    };

    extents.symmetricalAbout = function(x) {
        if (!arguments.length) {
            return symmetricalAbout;
        }
        symmetricalAbout = x;
        return extents;
    };

    return extents;
}
