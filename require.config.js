/* jshint unused:false */
/* global require: true */

var require = {
    baseUrl: '.',
    paths: {
        'd3': '../../dependencies/js/d3',
        'jstat': '../../dependencies/js/jstat',
        'moment': '../../dependencies/js/moment',
        'moment-range': '../../dependencies/js/moment-range',
        'promise': '../../dependencies/js/promise',
        
        'sl': '../../components/sl',
        'annotationSeries': '../../components/annotationSeries',
        'bollingerSeries': '../../components/bollingerSeries',
        'candlestickSeries': '../../components/candlestickSeries',
        'comparisonSeries': '../../components/comparisonSeries',
        'crosshairs': '../../components/crosshairs',
        'financeScale': '../../components/financeScale',
        'gridlines': '../../components/gridlines',
        'measure': '../../components/measure',
        'ohlcBar': '../../components/ohlcBar',
        'ohlcSeries': '../../components/ohlcSeries',
        'trackerSeries': '../../components/trackerSeries',
        'volumeSeries': '../../components/volumeSeries',
        'weekday': '../../components/weekday',
        'mockData': '../../components/mockData'
    },
    shim: {
        'weekday': {
            exports: 'weekday'
        }
    }
};