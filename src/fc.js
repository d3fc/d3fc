(function() {
    'use strict';

    // Crazyness to get a strict mode compliant reference to the global object
    var global = null;
    /* jshint ignore:start */
    global = (1, eval)('this');
    /* jshint ignore:end */

    global.fc = {
        charts: {},
        indicators: {
            algorithms: {
                calculators: {}
            },
            renderers: {}
        },
        scale: {
            discontinuity: {}
        },
        series: {},
        svg: {},
        tools: {},
        utilities: {}
    };
}());
