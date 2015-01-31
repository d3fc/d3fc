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
    math: {},
    /**
     * Useful complex scales which add to the D3 scales in terms of render quality.
     * Also, complex financial scales that can be added to a chart
     *
     * @namespace fc.scale
     */
    scale: {
        discontinuity: {}
    },
    series: {},
    tools: {},
    /**
     * Utility components to shorted long winded implementations of common operations.
     * Also includes components for mock data generation and layout.
     *
     * @namespace fc.utilities
     */
    utilities: {}
};