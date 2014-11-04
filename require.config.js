/* jshint unused:false */
/* global require: true */

var require = {
    baseUrl: '',
    paths: {
        'd3': '../../../examples/_dependencies/js/d3',
        'jstat': '../../../examples/_dependencies/js/jstat',
        'moment': '../../../examples/_dependencies/js/moment',
        'moment-range': '../../../examples/_dependencies/js/moment-range',
        'promise': '../../../examples/_dependencies/js/promise',
        
        'sl': '../../../components/sl',

        'bollingerBands': '../../../components/indicators/bollingerBands',
        'movingAverage': '../../../components/indicators/movingAverage',

        'financeScale': '../../../components/scale/financeScale',
        'gridlines': '../../../components/scale/gridlines',

        'candlestick': '../../../components/series/candlestick',
        'comparison': '../../../components/series/comparison',
        'ohlc': '../../../components/series/ohlc',
        'volume': '../../../components/series/volume',

        'crosshairs': '../../../components/tools/crosshairs',
        'annotation': '../../../components/tools/annotation',
        'measure': '../../../components/tools/measure',

        'weekday': '../../../components/utilities/weekday',
        'mockData': '../../../components/utilities/mockData'
    },
    shim: {
        'weekday': {
            exports: 'weekday'
        }
    }
};