/* jshint unused:false */
/* global require: true */
'use strict';
var require = {
    baseUrl: '',
    paths: {
        'd3': '../../../examples/_dependencies/js/d3',
        'jstat': '../../../examples/_dependencies/js/jstat',
        'moment': '../../../examples/_dependencies/js/moment',
        'moment-range': '../../../examples/_dependencies/js/moment-range',
        'promise': '../../../examples/_dependencies/js/promise',
        'jquery': '../../../examples/_dependencies/js/jquery',
        'bootstrap': '../../../examples/_dependencies/js/bootstrap',
        
        'sl': '../../../components/sl',

        'bollingerBands': '../../../components/indicators/bollingerBands',
        'movingAverage': '../../../components/indicators/movingAverage',

        'financeScale': '../../../components/scale/financeScale',
        'gridlines': '../../../components/scale/gridlines',

        'candlestick': '../../../components/series/candlestick',
        'comparison': '../../../components/series/comparison',
        'ohlc': '../../../components/series/ohlc',
        'volume': '../../../components/series/volume',

        'annotation': '../../../components/tools/annotation',
        'crosshairs': '../../../components/tools/crosshairs',
        'fibonacciFan': '../../../components/tools/fibonacciFan',
        'measure': '../../../components/tools/measure',

        'mockData': '../../../components/utilities/mockData',
        'dataGenerator': '../../../components/utilities/dataGenerator',
        'dimensions': '../../../components/utilities/dimensions',
        'weekday': '../../../components/utilities/weekday'
   },
    shim: {
        'weekday': {
            exports: 'weekday'
        },
        'bootstrap': {
            deps:['jquery']
        }
    }
};