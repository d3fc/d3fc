(function() {
    'use strict';

    // Needs to be defined like this so that the grunt task can update it
    var version = 'development';

    // Crazyness to get a strict mode compliant reference to the global object
    var global = null;
    /* jshint ignore:start */
    global = (1, eval)('this');
    /* jshint ignore:end */

    global.fc = {
        annotation: {},
        chart: {},
        data: {
            feed: {},
            random: {}
        },
        indicator: {
            algorithm: {
                calculator: {}
            },
            renderer: {}
        },
        scale: {
            discontinuity: {}
        },
        series: {
            stacked: {}
        },
        svg: {},
        tool: {},
        util: {},
        version: version
    };
}());
