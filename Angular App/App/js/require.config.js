/* jshint unused:false */
/* global require: true */

var require = {
    baseUrl: 'js',
    paths: {
        'd3': 'dist/d3.min',
        'jstat': 'dist/jstat',
        'moment': 'dist/moment',
        'moment-range': 'dist/moment-range',
        'promise': 'dist/promise',
        
        'sl': 'components/sl',
        'weekday': 'components/weekday',
        'mockData': 'components/mockData'
    },
    shim: {
        'weekday': {
            exports: 'weekday'
        }
    }
};