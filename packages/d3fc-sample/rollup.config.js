import babel from 'rollup-plugin-babel';

export default {
    entry: 'index.js',
    moduleName: 'fc_sample',
    format: 'umd',
    plugins: [ babel() ],
    dest: 'build/d3fc-sample.js',
    globals: {
        'd3-array': 'd3_array',
        'd3fc-rebind': 'fc_rebind'
    }
};
