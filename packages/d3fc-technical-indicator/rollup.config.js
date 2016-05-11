import babel from 'rollup-plugin-babel';

export default {
    entry: 'index.js',
    moduleName: 'fc_technical_indicator',
    format: 'umd',
    plugins: [ babel() ],
    dest: 'build/d3fc-technical-indicator.js',
    globals: {
        'd3fc-rebind': 'fc_rebind',
        'd3-array': 'd3_array'
    }
};
