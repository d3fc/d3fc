(function() {
    'use strict';

    // Needs to be defined like this so that the grunt task can update it
    var version = '0.2.2';

    // Crazyness to get a strict mode compliant reference to the global object
    var global = null;
    /* jshint ignore:start */
    global = (1, eval)('this');
    /* jshint ignore:end */

    global.fc = {
        annotation: {},
        chart: {},
        indicator: {
            algorithm: {
                calculator: {}
            },
            renderer: {}
        },
        scale: {
            discontinuity: {}
        },
        series: {},
        svg: {},
        tool: {},
        util: {},
        version: version
    };
}());
