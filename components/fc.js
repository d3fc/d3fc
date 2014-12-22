/* globals window */

/**
 * A collection of components that make it easy to build interactive financial charts with D3
 *
 * @namespace fc
 */
window.fc = {
    version: '0.0.0',
    /**
     * Studies, trend-lines and other financial indicators that can be added to a chart
     *
     * @namespace fc.indicators
     */
    indicators: {},
    /**
     * Useful complex scales which add to the D3 scales in terms of render quality.
     * Also, complex financial scales that can be added to a chart
     *
     * @namespace fc.scale
     */
    scale: {},
    series: {},
    tools: {},
    /**
     * Utility components to shorted long winded implementations of common operations.
     * Also includes components for mock data generation and layout.
     *
     * @namespace fc.utilities
     */
    utilities: {},

    /**
     * The extents function mirrors the D3 extent() function. It calculates a domain from
     * the data supplied, specifically arrays of arrays of objects.
     *
     * @namespace fc
     */
    extents: function(data, fields) {
        'use strict';

        var minValues = [],
            maxValues = [],
            fieldIndex = 0,
            getField = function(d) { return d[fields[fieldIndex]]; };

        // the function only operates on arrays, but we can pass non-array types in
        if (Object.prototype.toString.call(data) !== '[object Array]') {
            data = [data];
        }
        if (Object.prototype.toString.call(fields) !== '[object Array]') {
            fields = [fields];
        }

        // Fill the min and Max arrays for each data set
        for (var i = 0; i < data.length; i++) {
            for (fieldIndex = 0; fieldIndex < fields.length; fieldIndex++) {
                minValues.push(d3.min(data[i], getField));
                maxValues.push(d3.max(data[i], getField));
            }
        }

        // Return the smallest and largest
        return [
            d3.min(minValues, function(d) { return d; }),
            d3.max(maxValues, function(d) { return d; })
        ];
    }
};