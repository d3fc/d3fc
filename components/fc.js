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
    /**
     * Components which plot elements in 2 dimensional space using specified x and y scales.
     * @namespace fc.series
     */
    series: {},
    /**
     * @namespace fc.tools
     */
    tools: {},
    /**
     * Utility components to shorten long winded implementations of common operations.
     * Also includes components for mock data generation and layout.
     *
     * @namespace fc.utilities
     */
    utilities: {}
};