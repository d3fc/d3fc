import { linearExtent, dateExtent } from 'd3fc-extent';

export default function() {

    // eslint-disable-next-line
    console.warn('fc.util.extent is deprecated, consider using fc.util.linearExtent/dateExtent');

    var fields = [],
        extraPoints = [],
        pad = 0,
        padUnit = 'percent',
        symmetricalAbout = null;

    var extents = function(data) {
        // the fields can be a mixed array of property names or accessor functions
        var accessors = fields.map(function(field) {
            if (typeof field !== 'string') {
                return field;
            }
            return function(d) {
                return d[field];
            };
        });

        var peekedValue = data.length > 0 ? accessors[0](data[0]) : null;
        var extent = Object.prototype.toString.call(peekedValue) === '[object Date]' ? dateExtent : linearExtent;

        return extent()
            .accessors(accessors)
            .include(extraPoints)
            .pad(
                Array.isArray(pad) ? pad :
                [
                    padUnit === 'percent' ? pad / 2 : pad,
                    padUnit === 'percent' ? pad / 2 : pad
                ]
            )
            .padUnit(padUnit)
            .symmetricalAbout(symmetricalAbout)(data);
    };

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
