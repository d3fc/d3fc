import babel from 'rollup-plugin-babel';

export default {
    entry: 'index.js',
    moduleName: 'fc',
    format: 'umd',
    plugins: [ babel({
        'babelrc': false,
        'presets': ['es2015-rollup']
    })],
    dest: 'build/d3fc-random-data.js',
    globals: {
        'd3fc-rebind': 'fc_rebind',
        'd3-random': 'd3_random',
        'd3-time': 'd3_time'
    }
};
